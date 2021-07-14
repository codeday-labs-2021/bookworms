package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ReviewBody struct {
	UserName   string   `json:"user_name"`
	BookName   string   `json:"book_name"`
	Text       string   `json:"text"`
	Categories []string `json:"categories"`
}

// singular collection name from mongodb collections conventions
const ReviewsCollection = "review"

func filterReviews(filter interface{}, findOptions *options.FindOptions) ([]*db.Review, error) {

	// a slice to store decoded reviews
	var reviews []*db.Review

	DB, err := db.DB()

	// close db connection
	defer DB.Client().Disconnect(db.Ctx)

	if err != nil {
		return nil, err
	}

	cur, err := DB.Collection(ReviewsCollection).Find(db.Ctx, filter, findOptions)

	// once once done iterating the cursor close
	defer cur.Close(db.Ctx)

	if err != nil {
		return reviews, err
	}

	// Iterate over a returned cursor and decode each at a time

	for cur.Next(db.Ctx) {
		var r db.Review
		err := cur.Decode(&r)
		if err != nil {
			return reviews, err
		}

		reviews = append(reviews, &r)
	}

	if err := cur.Err(); err != nil {
		return reviews, err
	}

	return reviews, nil
}

func getAll(sortQery ...string) ([]*db.Review, error) {
	filter := bson.D{{}}
	findOptions := options.Find()

	sortByDate := findOptions.SetSort(bson.D{{"created_at", -1}})

	if len(sortQery) > 0 {
		sortKey, err := strconv.ParseInt(sortQery[0], 10, 32)
		if err != nil {
			return filterReviews(filter, sortByDate)
		}
		if sortKey == -1 || sortKey == 1 {
			sortOptions := findOptions.SetSort(bson.D{{"likes", sortKey}})
			return filterReviews(filter, sortOptions)
		}
	}

	return filterReviews(filter, sortByDate)
}

func createReview(review *db.Review) error {
	DB, err := db.DB()

	if err != nil {
		return err
	}

	DB.Collection(ReviewsCollection).InsertOne(db.Ctx, review)
	defer DB.Client().Disconnect(db.Ctx)
	return nil
}

func Reviews(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "GET":

		var reviews []*db.Review
		var err error

		sortQuery := r.URL.Query().Get("sort")

		if len(sortQuery) > 0 {
			reviews, err = getAll(sortQuery)
		} else {
			reviews, err = getAll()
		}

		if err != nil {
			utils.RespondWithError(w, "Failed to get reviews", http.StatusInternalServerError)
			return
		}

		utils.RespondWithSuccess(w, http.StatusOK, reviews)

	case "POST":
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
