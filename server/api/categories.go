package handler

import (
	"log"
	"net/http"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type categoriesResponse struct {
	Name string `json:"id"`
}

func findAllCategoris() ([]categoriesResponse, error) {

	// var categories []string

	DB, err := db.DB()

	if err != nil {
		return nil, err
	}

	categoriesProjector := bson.D{{Key: "$project", Value: bson.D{{Key: "categories", Value: 1}}}}

	showCategoriesCursor, err := db.ReviewCollection.Aggregate(db.Ctx, mongo.Pipeline{categoriesProjector})

	defer DB.Client().Disconnect(db.Ctx)

	var decodedCategories []bson.M

	if err = showCategoriesCursor.All(db.Ctx, &decodedCategories); err != nil {
		panic(err)
	}

	for _, value := range decodedCategories {
		for _, v := range value {
			if data, ok := v.(primitive.A); ok {
				deserialized := []string(data)
				log.Println(deserialized)
			}
		}
	}

	return nil, nil
}

func Categories(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		findAllCategoris()
	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}
