package handler

import (
	"errors"
	"log"
	"net/http"
	"net/url"
	"path"
	"sort"
	"strings"
	"time"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ReviewBody struct {
	BookName   string   `json:"book_name"`
	Text       string   `json:"text"`
	Categories []string `json:"categories"`
}

type DeleteResponse struct {
	Message bool `json:"message"`
}

func getReviews(sortQuery string, sortOrder string, searchQuery string, categoriesQuery string) ([]db.Review, error) {
	var reviewsCursor *mongo.Cursor
	var err error

	DB, err := db.DB()

	var reviews []db.Review

	// close db connection
	defer func() {
		if err := DB.Client().Disconnect(db.Ctx); err != nil {
			panic(err)
		}
	}()

	if err != nil {
		return nil, err
	}

	opts := options.Find()

	if len(sortQuery) > 0 {

		if len(sortOrder) < 0 {
			return nil, errors.New("Specify your sorting order!")
		}

		numSortOrder, err := utils.ConvertStringToNum(sortOrder)

		if err != nil {
			numSortOrder = -1
		}

		if validateSort(sortQuery) {
			return nil, errors.New("Invalid sort Query")
		}

		opts.SetSort(bson.D{{Key: sortQuery, Value: numSortOrder}})

	} else if len(searchQuery) == 0 {
		opts.SetSort(bson.D{{Key: "created_at", Value: -1}})
	}

	filter := bson.M{}

	if len(categoriesQuery) > 0 {
		filter = bson.M{"categories": bson.M{"$in": strings.Split(categoriesQuery, ",")}}
	}

	reviewsCursor, err = DB.Collection(db.ReviewsCollection).Find(db.Ctx, filter, opts)

	if err != nil {
		return nil, err
	}

	if err = reviewsCursor.All(db.Ctx, &reviews); err != nil {
		return nil, err
	}

	if len(searchQuery) > 0 {

		var sort string

		if len(sortQuery) > 0 && validateSort(sortQuery) {
			sort = sortQuery
		} else {
			sort = "likes"
		}
		return search(reviews, searchQuery, sort)
	}

	return reviews, nil
}

func validateSort(sortQuery string) bool {
	return sortQuery != "likes" && sortQuery != "book_name" && sortQuery != "created_at"
}

func search(reviews []db.Review, search string, sort string) ([]db.Review, error) {

	searchKeywords := utils.RemoveDuplicateUtility(strings.Split(search, " "))

	reviewsWithKeyword := make(map[primitive.ObjectID]db.Review)

	// Review body should contain matched keyword atleast once
	for _, entry := range reviews {
		for _, item := range searchKeywords {
			if strings.Contains(strings.ToLower(entry.Text), item) {
				reviewsWithKeyword[entry.ID] = entry
			}
		}
	}

	withKeywordsReviews := make([]db.Review, 0)

	for _, value := range reviewsWithKeyword {
		withKeywordsReviews = append(withKeywordsReviews, value)
	}

	occurences := make(map[primitive.ObjectID]int)

	//Find occurence of keyword in each review
	for _, item := range withKeywordsReviews {
		for _, entry := range searchKeywords {
			occurences[item.ID] += strings.Count(strings.ToLower(item.Text), entry)
		}
	}

	if len(occurences) == 0 {
		return reviews, nil
	}

	sortReviews(&withKeywordsReviews, occurences, sort)

	return withKeywordsReviews, nil
}

type SortableReview struct {
	reviews   []db.Review
	frequency map[primitive.ObjectID]int
	sortQuery string
}

func (s SortableReview) Len() int {
	return len(s.reviews)
}

func (s SortableReview) Less(i, j int) bool {
	less := s.frequency[s.reviews[i].ID] > s.frequency[s.reviews[j].ID]
	if s.frequency[s.reviews[i].ID] == s.frequency[s.reviews[j].ID] {
		if s.sortQuery == "book_name" {
			less = s.reviews[i].BookName > s.reviews[j].BookName
		} else if s.sortQuery == "created_at" {
			less = utils.ConvertDate(s.reviews[i].CreatedAt) > utils.ConvertDate(s.reviews[j].CreatedAt)
		} else {
			less = len(s.reviews[i].Likes) > len(s.reviews[j].Likes)
		}
	}
	return less
}

func (s SortableReview) Swap(i, j int) {
	s.reviews[j], s.reviews[i] = s.reviews[i], s.reviews[j]
}

func sortReviews(reviews *[]db.Review, occurence map[primitive.ObjectID]int, sortQuery string) {
	sort.Sort(SortableReview{
		reviews:   *reviews,
		frequency: occurence,
		sortQuery: sortQuery,
	})
}

func createReview(review *db.Review) error {
	DB, err := db.DB()

	if err != nil {
		return err
	}

	DB.Collection(utils.ReviewsCollection).InsertOne(db.Ctx, review)

	defer DB.Client().Disconnect(db.Ctx)
	return nil
}

func ReviewsHandler(w http.ResponseWriter, r *http.Request) {
	utils.HandleCors(&w, "GET, POST")
	switch r.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)
	case http.MethodGet:
		var reviews []db.Review
		var err error

		query, err := url.ParseQuery(r.URL.RawQuery)

		if err != nil {
			utils.RespondWithError(w, "Failed to parse query", http.StatusBadRequest)
		}

		sortQuery := query.Get("sort")
		searchQuery := query.Get("search")
		categoriesQuery := query.Get("categories")
		sortOrder := query.Get("sortOrder")

		reviews, err = getReviews(sortQuery, sortOrder, searchQuery, categoriesQuery)

		if err != nil {
			utils.RespondWithError(w, "Failed to get reviews: "+err.Error(), http.StatusInternalServerError)
			return
		}

		utils.RespondWithSuccess(w, http.StatusOK, reviews)

	case http.MethodPost:
		user, err := utils.GetUserFromCookie(r)

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusUnauthorized)
			return
		}

		var request ReviewBody

		err = utils.DecodeJSONBody(w, r, &request)

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusBadRequest)
			return
		}

		// validate request and Handle errors
		if len(request.BookName) == 0 || len(request.Text) == 0 || len(request.Categories) == 0 {
			utils.RespondWithError(w, "All fields are required", http.StatusBadRequest)
			return
		}

		review := db.Review{
			ID:         primitive.NewObjectID(),
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
			BookName:   request.BookName,
			User:       user.ID,
			Text:       request.Text,
			Categories: request.Categories,
		}

		err = createReview(&review)

		if err != nil {
			utils.RespondWithError(w, "Failed to create review", http.StatusInternalServerError)
			return
		}

		utils.RespondWithSuccess(w, http.StatusCreated, review)

	case http.MethodDelete:
		user, err := utils.GetUserFromCookie(r)

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusUnauthorized)
			return
		}

		log.Print(r.URL.RequestURI())

		u, _ := url.Parse(r.URL.RequestURI())

		requestId := path.Base(u.Path)

		if len(requestId) == 0 {
			utils.RespondWithError(w, "Review id should be passed!", http.StatusBadRequest)
			return
		}

		DB, err := db.DB()

		// close db connection
		defer func() {
			if err := DB.Client().Disconnect(db.Ctx); err != nil {
				panic(err)
			}
		}()

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var reviewFromID db.Review

		objectId, err := primitive.ObjectIDFromHex(requestId)

		if err != nil {
			utils.RespondWithError(w, "Invalid id passed", http.StatusBadRequest)
			return
		}

		// check if collection exists and owned by user
		if err := DB.Collection(db.ReviewsCollection).FindOne(db.Ctx, bson.D{{"_id", objectId}}).Decode(&reviewFromID); err != nil {
			if err == mongo.ErrNoDocuments {
				utils.RespondWithError(w, "Review passed doesn't exist", http.StatusBadRequest)
				return
			}
			utils.RespondWithError(w, err.Error(), http.StatusBadRequest)
			return
		}

		if reviewFromID.User != user.ID {
			utils.RespondWithError(w, "You are not allowed to delete review you don't own!", http.StatusNonAuthoritativeInfo)
			return
		}

		_, err = DB.Collection(db.ReviewsCollection).DeleteOne(db.Ctx, bson.D{{"_id", objectId}})

		if err != nil {
			utils.RespondWithError(w, "Delete failed!", http.StatusInternalServerError)
		}

		utils.RespondWithSuccess(w, http.StatusOK, nil)
	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}
