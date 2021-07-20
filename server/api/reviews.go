package handler

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
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

// Use $text for better search and ranking

func getAll(sortQuery string, searchQuery string) ([]db.Review, error) {
	var reviewsCursor *mongo.Cursor
	var err error

	DB, err := db.DB()

	if err != nil {
		return nil, err
	}

	// close db connection
	defer func() {
		if err := DB.Client().Disconnect(db.Ctx); err != nil {
			panic(err)
		}
	}()

	opts := options.Find()

	if len(sortQuery) > 0 {
		recencySort, err := utils.ConvertStringToNum(sortQuery)

		if err != nil {
			return nil, errors.New("Invalid value for sort query")
		}

		if recencySort == 1 {
			opts.SetSort(bson.D{{Key: "likes", Value: 1}})
		} else {
			opts.SetSort(bson.D{{Key: "likes", Value: -1}})
		}

	} else {
		opts.SetSort(bson.D{{Key: "likes", Value: -1}})
	}

	matchKeyWord := bson.D{{Key: "book_name", Value: bson.D{{
		Key: "$regex", Value: primitive.Regex{Pattern: fmt.Sprintf("^%s.*", searchQuery), Options: "i"}}}}}

	if len(searchQuery) > 0 {
		reviewsCursor, err = DB.Collection(db.ReviewsCollection).Find(db.Ctx, matchKeyWord, opts)
	} else {
		reviewsCursor, err = DB.Collection(db.ReviewsCollection).Find(db.Ctx, bson.M{}, opts)
	}

	if err != nil {
		return nil, err
	}

	var reviews []db.Review

	if err = reviewsCursor.All(db.Ctx, &reviews); err != nil {
		return nil, err
	}

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
		var reviews []db.Review
		var err error

		query, err := url.ParseQuery(r.URL.RawQuery)

		if err != nil {
			utils.RespondWithError(w, "Failed to parse query", http.StatusBadRequest)
		}

		sortQuery := query.Get("sort")
		searchQuery := query.Get("search")

		reviews, err = getAll(sortQuery, searchQuery)

		if err != nil {
			utils.RespondWithError(w, "Failed to get reviews: "+err.Error(), http.StatusInternalServerError)
			return
		}

		utils.RespondWithSuccess(w, http.StatusOK, reviews)

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
