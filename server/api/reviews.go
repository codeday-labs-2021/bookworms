package handler

import (
	"encoding/json"
	"fmt"
	"log"
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
var ReviewsCollection = "review"

func filterReviews(filter interface{}) ([]*db.Review, error) {

	// a slice to store decoded reviews
	var reviews []*db.Review

	cur, err := db.DB().Collection(ReviewsCollection).Find(db.Ctx, filter)

	if err != nil {
		return reviews, err
	}

	// Iterate over a returned cursor and decode each at a time

	for cur.Next(db.Ctx) {
		var r db.Review
		err := cur.Decode(&r)
		if err != nil {
			return reviews, nil
		}

		reviews = append(reviews, &r)
	}

	if err := cur.Err(); err != nil {
		return reviews, nil
	}

	// once once done iterating the cursor close
	cur.Close(db.Ctx)

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
	return err
}

func Reviews(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "GET":
		reviews, err := getAll()

		if err != nil && err != mongo.ErrNoDocuments {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"message": "Something went wrong!"})
			return
		}

		response, err := json.Marshal(reviews)

		if err != nil {
			utils.RespondWithError(w, "Something went wrong!", http.StatusInternalServerError)
			return
		}

		db.DB().Client().Disconnect(db.Ctx)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(response)
	case "POST":
		var request ReviewBody

		err := utils.DecodeJSONBody(w, r, &request)

		if err != nil {
			utils.RespondWithError(w, err.Error(), 400)
		}

		// validate request and Handle errors
		if len(request.UserName) == 0 || len(request.BookName) == 0 || len(request.Text) == 0 || len(request.Categories) == 0 {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"message": "All fields are required"})
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
			log.Fatal(err)
		}

		response, err := json.Marshal(review)

		if err != nil {
			return
		}

		db.DB().Client().Disconnect(db.Ctx)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write(response)

	default:
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "Bad request: ", r.Method, r.URL)
	}

}
