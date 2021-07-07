package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/jeromewu/bookworms/server/db"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

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

		fmt.Println(reviews)

		json.NewEncoder(w).Encode(reviews)

	default:
		fmt.Fprint(w, "Bad request: ", r.Method, r.URL)
	}

}
