package handler

import (
	"net/http"
	"strings"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
)

func filterReview(searchQeury []string) ([]*db.Review, error) {

	var reviews []*db.Review

	DB, err := db.DB()

	defer DB.Client().Disconnect(db.Ctx)

	if err != nil {
		return nil, err
	}

	// cur, err := DB.Collection(db.ReviewsCollection).Find(
	// 	db.Ctx,
	// 	bson.M{"categories": searchQeury},
	// )
	cur, err := DB.Collection(db.ReviewsCollection).Find(
		db.Ctx,
		bson.M{
			"categories": bson.M{"$in": searchQeury}},
	)

	// once once done iterating the cursor close
	defer cur.Close(db.Ctx)

	if err != nil {
		return nil, err
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

func FilterHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":

		query := r.URL.Query().Get("category")

		if len(query) <= 0 {
			utils.RespondWithError(w, "Filter query must be specified", http.StatusBadRequest)
			return
		}

		reviews, err := filterReview(strings.Split(query, ","))

		if err != nil {
			utils.RespondWithError(w, "Failed to search!", http.StatusInternalServerError)
			return
		}

		utils.RespondWithSuccess(w, http.StatusOK, reviews)

	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}
