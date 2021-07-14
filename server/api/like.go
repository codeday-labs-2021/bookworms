package handler

import (
	"net/http"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type newLikeBody struct {
	ReviewID string `json:"review_id"`
}

func likeReview(id string, review *db.Review) error {

	DB, err := db.DB()

	if err != nil {
		return err
	}

	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return err
	}

	_, err = DB.Collection(db.ReviewsCollection).UpdateOne(
		db.Ctx,
		bson.M{"_id": objectID},
		bson.D{
			{Key: "$inc", Value: bson.D{{Key: "likes", Value: 1}}},
		},
		options.Update().SetUpsert(true),
	)

	if err != nil {
		return err
	}

	review.Likes += 1

	defer DB.Client().Disconnect(db.Ctx)

	return nil
}

func FindReview(id string, review *db.Review) error {
	DB, err := db.DB()

	if err != nil {
		return err
	}

	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return err
	}

	err = DB.Collection(db.ReviewsCollection).FindOne(db.Ctx, bson.M{"_id": objectID}).Decode(&review)

	if err != nil {
		return err
	}

	defer DB.Client().Disconnect(db.Ctx)
	return nil
}

func LikeHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":

		var requestBody newLikeBody
		var review db.Review

		err := utils.DecodeJSONBody(w, r, &requestBody)

		if err != nil {
			utils.RespondWithError(w, "Failed to parse body!", http.StatusBadRequest)
			return
		}

		err = FindReview(requestBody.ReviewID, &review)

		if err != nil {
			utils.RespondWithError(w, "Post not found!", http.StatusBadRequest)
			return
		}

		err = likeReview(requestBody.ReviewID, &review)

		if err != nil {
			utils.RespondWithError(w, "Failed to add like", http.StatusInternalServerError)
			return
		}

		utils.RespondWithSuccess(w, http.StatusAccepted, review)

	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}
