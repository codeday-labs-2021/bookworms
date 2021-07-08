package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type ReviewBody struct {
	BookName string `json:"book_name"`
}

func filterReviews(filter interface{}) ([]*db.Review, error) {
	// a slice to store decoded reviews
	var reviews []*db.Review

	cur, err := db.DB().Collection("reviews").Find(db.Ctx, filter)

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

func Reviews(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		reviews, err := getAll()

		if err != nil && err != mongo.ErrNoDocuments {
			fmt.Println("error here")
			return
		}

		json.NewEncoder(w).Encode(reviews)
	case "POST":
		var request ReviewBody

		utils.DecodeJSONBody(w, r, &request)

		log.Println(request)

	default:
		fmt.Fprint(w, "Bad request: ", r.Method, r.URL)
	}

}
