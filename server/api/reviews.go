package handler

import (
	"errors"
	"net/http"
	"net/url"
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
	UserName   string   `json:"user_name"`
	BookName   string   `json:"book_name"`
	Text       string   `json:"text"`
	Categories []string `json:"categories"`
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
			return nil, errors.New("Invalid value for sort operation")
		}

		if sortQuery != "likes" && sortQuery != "book_name" && sortQuery != "created_at" {
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
		return search(reviews, searchQuery)
	}

	return reviews, nil
}

func search(reviews []db.Review, search string) ([]db.Review, error) {

	searchKeywords := strings.Split(search, " ")

	reviewsWithKeyword := make(map[primitive.ObjectID]db.Review)

	// Review body should contain matched keyword atleast once
	for _, item := range searchKeywords {
		for _, entry := range reviews {
			if strings.Contains(strings.ToLower(entry.Text), item) {
				reviewsWithKeyword[entry.ID] = entry
			}
		}
	}

	withKeywordsReviews := make([]db.Review, 0)

	for _, value := range reviewsWithKeyword {
		withKeywordsReviews = append(withKeywordsReviews, value)
	}

	occurences := make(map[primitive.ObjectID]map[string]int)

	//Find occurence of keyword in each review
	for _, item := range withKeywordsReviews {
		for _, entry := range searchKeywords {
			reviewBodyArray := strings.Split(strings.ToLower(strings.Trim(item.Text, " ")), " ")
			for _, reviewItem := range reviewBodyArray {
				if contains(reviewBodyArray, entry) {
					_, ok := occurences[item.ID]

					if !ok {
						occurences[item.ID] = make(map[string]int)
					}
					if reviewItem == entry {
						occurences[item.ID][reviewItem] += 1
					}
				}
			}
		}
	}

	if len(occurences) == 0 {
		return reviews, nil
	}

	occurenceMap := make(map[primitive.ObjectID]int)

	for index, item := range occurences {
		for _, entry := range item {
			occurenceMap[index] = entry
		}
	}

	sortReviews(&withKeywordsReviews, occurenceMap)

	return withKeywordsReviews, nil
}

type SortableReview struct {
	reviews   []db.Review
	frequency map[primitive.ObjectID]int
}

func (s SortableReview) Len() int {
	return len(s.reviews)
}

func (s SortableReview) Less(i, j int) bool {
	less := s.frequency[s.reviews[i].ID] > s.frequency[s.reviews[j].ID]
	if s.frequency[s.reviews[i].ID] == s.frequency[s.reviews[j].ID] {
		less = s.reviews[i].Likes > s.reviews[j].Likes
	}
	return less
}

func (s SortableReview) Swap(i, j int) {
	s.reviews[j], s.reviews[i] = s.reviews[i], s.reviews[j]
}

func sortReviews(reviews *[]db.Review, occurence map[primitive.ObjectID]int) {
	sort.Sort(SortableReview{
		reviews:   *reviews,
		frequency: occurence,
	})
}

func contains(slice []string, item string) bool {
	for _, entry := range slice {
		if entry == item {
			return true
		}
	}
	return false
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
		var request ReviewBody

		err := utils.DecodeJSONBody(w, r, &request)

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusBadRequest)
			return
		}

		// validate request and Handle errors

		if len(request.UserName) == 0 || len(request.BookName) == 0 || len(request.Text) == 0 || len(request.Categories) == 0 {
			utils.RespondWithError(w, "All fields are required", http.StatusBadRequest)
			return
		}

		review := db.Review{
			ID:         primitive.NewObjectID(),
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
			UserName:   request.UserName,
			BookName:   request.BookName,
			Text:       request.Text,
			Categories: request.Categories,
		}

		err = createReview(&review)

		if err != nil {
			utils.RespondWithError(w, "Failed to create review", http.StatusInternalServerError)
			return
		}

		utils.RespondWithSuccess(w, http.StatusCreated, review)

	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}
