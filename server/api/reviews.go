package handler

import (
	"net/http"
	"time"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ReviewBody struct {
	UserName   string   `json:"user_name"`
	BookName   string   `json:"book_name"`
	Text       string   `json:"text"`
	Categories []string `json:"categories"`
}

// singular collection name from mongodb collections conventions
const ReviewsCollection = "review"

func filterReviews(filter interface{}) ([]*db.Review, error) {

	// a slice to store decoded reviews
	var reviews []*db.Review

	cur, err := db.DB().Collection(ReviewsCollection).Find(db.Ctx, filter)

	// close db connection
	defer db.DB().Client().Disconnect(db.Ctx)

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

	if len(reviews) == 0 {
		return reviews, mongo.ErrNoDocuments
	}

	return reviews, nil
}

func getAll() ([]*db.Review, error) {
	// Passing bson.D{{}} matches all documents in a collection
	filter := bson.D{{}}
	return filterReviews(filter)
}

func createReview(review *db.Review) error {
	_, err := db.DB().Collection(ReviewsCollection).InsertOne(db.Ctx, review)
	defer db.DB().Client().Disconnect(db.Ctx)
	return err
}

func Reviews(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "GET":
		reviews, _ := getAll()

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
