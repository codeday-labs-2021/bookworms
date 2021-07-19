package handler

import (
	"log"
	"net/http"
	"time"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ReviewBody struct {
	UserName   string   `json:"user_name"`
	BookName   string   `json:"book_name"`
	Text       string   `json:"text"`
	Categories []string `json:"categories"`
}

func getAll(sortQuery string, searchQuery string, categoriesQuery string) ([]db.Review, error) {

	// log.Println(sortQuery)
	// log.Println(searchQuery)
	// log.Println(categoriesQuery)

	opts := options.Find()

	opts.SetSort(bson.D{{Key: "likes", Value: -1}})

	matchKeyWord := bson.D{{Key: "$match", Value: bson.D{{Key: "book_name", Value: searchQuery}}}}

	reviewsCursor, err := db.ReviewCollection.Aggregate(db.Ctx, mongo.Pipeline{matchKeyWord})

	var reviews []db.Review

	if err = reviewsCursor.All(db.Ctx, &reviews); err != nil {
		return nil, err
	}

	// agree gaters
	log.Println(reviews)

	return reviews, nil
}

func createReview(review *db.Review) error {
	DB, err := db.DB()

	if err != nil {
		return err
	}

	DB.Collection(utils.ReviewsCollection).InsertOne(db.Ctx, review)
	defer DB.Client().Disconnect(db.Ctx)
	return nil
}

func ReviewsHandler(w http.ResponseWriter, r *http.Request) {
	utils.HandleCors(&w, "GET, POST")
	switch r.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)
	case http.MethodGet:
		// var reviews []db.Review
		// var err error

		// log.Println("here")

		// sortQuery := r.URL.Query().Get("sort")
		// searchQuery := r.URL.Query().Get("search")
		// categoriesQuery := r.URL.Query().Get("categories")

		// reviews, err = getAll(sortQuery, searchQuery, categoriesQuery)

		// if err != nil {
		// 	utils.RespondWithError(w, "Failed to get reviews", http.StatusInternalServerError)
		// 	return
		// }

		// utils.RespondWithSuccess(w, http.StatusOK, reviews)

	case http.MethodPost:
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
