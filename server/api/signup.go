package handler

import (
	"errors"
	"net/http"
	"time"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func signUp(request signupRequest) (*signupResponse, error) {
	DB, err := db.DB()

	// close db connection
	defer func() {
		if err := DB.Client().Disconnect(db.Ctx); err != nil {
			panic(err)
		}
	}()

	if err != nil {
		return nil, err
	}

	var user bson.M

	if err = DB.Collection(db.UserCollection).FindOne(db.Ctx, bson.D{{Key: "email", Value: request.Email}}).Decode(&user); err != nil && err != mongo.ErrNoDocuments {
		return nil, err
	}

	if user != nil {
		return nil, errors.New("User already exists!")
	}

	newUser := db.User{
		ID:        primitive.NewObjectID(),
		Name:      request.Name,
		Email:     request.Email,
		Password:  utils.HashPassword(request.Password),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	DB.Collection(db.UserCollection).InsertOne(db.Ctx, newUser)

	return &signupResponse{
		Name:      newUser.Name,
		Email:     newUser.Email,
		CreatedAt: utils.ConvertDate(newUser.CreatedAt),
		UpdatedAt: utils.ConvertDate(newUser.UpdatedAt),
	}, nil
}

type signupResponse struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
}

type signupRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	utils.HandleCors(&w, "POST")
	switch r.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)

	case http.MethodPost:

		var request signupRequest

		err := utils.DecodeJSONBody(w, r, &request)

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusBadRequest)
			return
		}

		if len(request.Email) == 0 || len(request.Name) == 0 || len(request.Password) == 0 {
			utils.RespondWithError(w, "All fields are required!", http.StatusNotFound)
			return
		}

		if !utils.ValidEmail(request.Email) {
			utils.RespondWithError(w, "Email should be valid!", http.StatusBadRequest)
			return
		}

		if len(request.Password) < 5 {
			utils.RespondWithError(w, "Password must be atleast 5 characters", http.StatusBadRequest)
			return
		}

		response, err := signUp(request)

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusBadRequest)
			return
		}

		utils.RespondWithSuccess(w, http.StatusCreated, response)
	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}

}
