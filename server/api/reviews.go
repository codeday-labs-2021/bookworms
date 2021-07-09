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
	Names      string   `json:"user_name"`
	BookName   string   `json:"book_name"`
	BookReview string   `json:"text"`
	Categories []string `json:"categories"`
}

// singular collection name from mongodb collections conventions
var ReviewsCollection = "review"

func filterReviews(filter interface{}) ([]*db.Review, error) {

	// a slice to store decoded reviews
	var reviews []*db.Review

	cur, err := db.DB().Collection(ReviewsCollection).Find(db.Ctx, filter)

	if err != nil {
		return reviews, nil
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
	// Passing bson.D matteches all documents in a collection
	filter := bson.D{{}}
	return filterReviews(filter)
}

func createReview(review *db.Review) error {
	_, err := db.DB().Collection(ReviewsCollection).InsertOne(db.Ctx, review)
	return err
}

func Reviews(w http.ResponseWriter, r *http.Request) {

	log.Println(r.URL.Query())

	switch r.Method {
	case "GET":
		reviews, err := getAll()

		if err != nil && err != mongo.ErrNoDocuments {
			fmt.Println("error here")
			return
		}

		response, err := json.Marshal(reviews)

		if err != nil {
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write(response)
	case "POST":
		var request ReviewBody

		err := utils.DecodeJSONBody(w, r, &request)

		if err != nil {
			utils.ErrorResponse(w, err.Error(), 401)
		}

		review := db.Review{
			ID:             primitive.NewObjectID(),
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
			Names:          request.Names,
			BookName:       request.BookName,
			BookReview:     request.BookReview,
			BookCategories: request.Categories,
		}

		err = createReview(&review)

		if err != nil {
			log.Fatal(err)
		}

		response, err := json.Marshal(review)

		if err != nil {
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write(response)

	default:
		fmt.Fprint(w, "Bad request: ", r.Method, r.URL)
	}

}
