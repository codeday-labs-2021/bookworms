package handler

import (
	"net/http"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func findAllCategoris() ([]string, error) {

	var categories []string

	DB, err := db.DB()

	if err != nil {
		return nil, err
	}

	defer func() {
		if err := DB.Client().Disconnect(db.Ctx); err != nil {
			panic(err)
		}
	}()

	categoriesProjector := bson.D{{Key: "$project", Value: bson.D{{Key: "categories", Value: 1}, {Key: "_id", Value: 0}}}}

	showCategoriesCursor, err := db.ReviewCollection.Aggregate(db.Ctx, mongo.Pipeline{categoriesProjector})

	if err != nil {
		return nil, err
	}

	var decodedCategories []db.Review

	if err = showCategoriesCursor.All(db.Ctx, &decodedCategories); err != nil {
		return nil, err
	}

	for _, value := range decodedCategories {
		categories = append(categories, value.Categories...)
	}

	return utils.RemoveDuplicates(categories), nil
}

func CategoriesHandler(w http.ResponseWriter, r *http.Request) {
	utils.HandleCors(&w, "GET")
	switch r.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)
	case http.MethodGet:
		categorisData, err := findAllCategoris()

		if err != nil {
			utils.RespondWithError(w, "Failed to get categories!", http.StatusBadRequest)
			return
		}

		utils.RespondWithSuccess(w, http.StatusOK, categorisData)
	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}
