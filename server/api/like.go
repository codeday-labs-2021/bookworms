package handler

import (
	"net/http"
	"strings"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func likeReview(id primitive.ObjectID, review *db.Review) error {

	DB, err := db.DB()

	defer func() {
		if err := DB.Client().Disconnect(db.Ctx); err != nil {
			panic(err)
		}
	}()

	if err != nil {
		return err
	}

	_, err = DB.Collection(db.ReviewsCollection).UpdateOne(
		db.Ctx,
		bson.M{"_id": review.ID},
		bson.D{
			{Key: "$push", Value: bson.D{{Key: "likes", Value: id}}},
		},
		options.Update().SetUpsert(true),
	)

	if err != nil {
		return err
	}

	review.Likes = append(review.Likes, id)

	return nil
}

func unlikeReview(id primitive.ObjectID, review *db.Review) error {

	DB, err := db.DB()

	defer func() {
		if err := DB.Client().Disconnect(db.Ctx); err != nil {
			panic(err)
		}
	}()

	if err != nil {
		return err
	}

	statement := bson.M{"$pull": bson.M{"likes": bson.M{"$in": bson.A{id}}}}

	_, err = DB.Collection(db.ReviewsCollection).UpdateOne(
		db.Ctx,
		bson.M{"_id": review.ID},
		statement,
		options.Update().SetUpsert(true),
	)

	if err != nil {
		return err
	}

	review.Likes = removeItemFromSlice(review.Likes, id)

	return nil
}

func removeItemFromSlice(s []primitive.ObjectID, x primitive.ObjectID) []primitive.ObjectID {
	var result []primitive.ObjectID
	for index, value := range s {
		if value == x {
			result = append(s[:index], s[index+1:]...)
		}
	}

	return result
}

func findReview(id string, review *db.Review) error {
	DB, err := db.DB()

	defer func() {
		if err := DB.Client().Disconnect(db.Ctx); err != nil {
			panic(err)
		}
	}()

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

	return nil
}

func LikeHandler(w http.ResponseWriter, r *http.Request) {

	utils.HandleCors(&w, "POST")

	switch r.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)
	case http.MethodPost:
		user, err := utils.GetUserFromCookie(r)

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusUnauthorized)
			return
		}

		requestId := utils.GetIdFromUrl(r)

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
		if err := DB.Collection(db.ReviewsCollection).FindOne(db.Ctx, bson.D{{Key: "_id", Value: objectId}}).Decode(&reviewFromID); err != nil {
			if err == mongo.ErrNoDocuments {
				utils.RespondWithError(w, "Review  doesn't exist", http.StatusBadRequest)
				return
			}
			utils.RespondWithError(w, err.Error(), http.StatusBadRequest)
			return
		}

		// unlike if user has aleady liked
		if contains(reviewFromID.Likes, user.ID) {
			err := unlikeReview(user.ID, &reviewFromID)
			if err != nil {
				utils.RespondWithError(w, "Failed to add like", http.StatusInternalServerError)
				return

			}
			utils.RespondWithSuccess(w, http.StatusCreated, reviewFromID)
			return
		}

		//like here
		err = likeReview(user.ID, &reviewFromID)

		if err != nil {
			utils.RespondWithError(w, "Failed to add like", http.StatusInternalServerError)
			return
		}
		utils.RespondWithSuccess(w, http.StatusCreated, reviewFromID)
	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}

func contains(s []primitive.ObjectID, e primitive.ObjectID) bool {
	for _, a := range s {
		if strings.EqualFold(a.Hex(), e.Hex()) {
			return true
		}
	}
	return false
}
