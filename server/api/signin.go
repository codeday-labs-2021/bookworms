package handler

import (
	"errors"
	"net/http"
	"time"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type signinRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type signinResponse struct {
	Message bool `json:"message"`
}

func signin(request signinRequest) (*signinResponse, error, *string) {
	DB, err := db.DB()

	// close db connection
	defer func() {
		if err := DB.Client().Disconnect(db.Ctx); err != nil {
			panic(err)
		}
	}()

	if err != nil {
		return nil, err, nil
	}

	var user db.User

	err = DB.Collection(db.UserCollection).FindOne(db.Ctx, bson.D{{Key: "email", Value: request.Email}}).Decode(&user)

	if err == mongo.ErrNoDocuments {
		return nil, errors.New("user not found!"), nil
	} else if err != nil {
		return nil, err, nil
	}

	if !utils.CheckHashPassword(request.Password, user.Password) {
		return nil, errors.New("Email or password missmatch!"), nil
	}

	claims := &utils.Claims{
		User: user,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(utils.Jwt_key)

	if err != nil {
		return nil, err, nil
	}

	return &signinResponse{
		Message: true,
	}, nil, &tokenString
}

func SigninHandler(w http.ResponseWriter, r *http.Request) {
	utils.HandleCors(&w, "POST")
	switch r.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)
	case http.MethodPost:

		// usr, err := utils.GetUserFromCookie(r)

		// if err != nil {
		// 	utils.RespondWithError(w, err.Error(), http.StatusUnauthorized)
		// 	return
		// }

		// log.Println(usr)

		var request signinRequest

		err := utils.DecodeJSONBody(w, r, &request)

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusBadRequest)
			return
		}

		response, err, token := signin(request)

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusBadRequest)
			return
		}

		if token != nil {
			http.SetCookie(w, &http.Cookie{
				Name:     "token",
				Value:    *token,
				Expires:  time.Now().Add(time.Hour * 1),
				HttpOnly: true,
			})
		}

		utils.RespondWithSuccess(w, http.StatusAccepted, response)

	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}
