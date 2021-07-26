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

func signin(request signinRequest) (*signinResponse, *string, error) {
	DB, err := db.DB()

	// close db connection
	defer func() {
		if err := DB.Client().Disconnect(db.Ctx); err != nil {
			panic(err)
		}
	}()

	if err != nil {
		return nil, nil, err
	}

	var user db.User

	err = DB.Collection(db.UserCollection).FindOne(db.Ctx, bson.D{{Key: "email", Value: request.Email}}).Decode(&user)

	if err == mongo.ErrNoDocuments {
		return nil, nil, errors.New("user not found!")
	} else if err != nil {
		return nil, nil, err
	}

	if !utils.CheckHashPassword(request.Password, user.Password) {
		return nil, nil, errors.New("Email or password missmatch!")
	}

	claims := &utils.Claims{
		User: user,
		StandardClaims: jwt.StandardClaims{
			//Should last for 24 hours
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(utils.Jwt_key)

	if err != nil {
		return nil, nil, err
	}

	return &signinResponse{
		Message: true,
	}, &tokenString, nil
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

		if len(request.Email) == 0 || len(request.Password) == 0 {
			utils.RespondWithError(w, "All fields are required!", http.StatusBadRequest)
			return
		}

		response, token, err := signin(request)

		if err != nil {
			utils.RespondWithError(w, err.Error(), http.StatusBadRequest)
			return
		}

		if token != nil {
			http.SetCookie(w, &http.Cookie{
				Name:     "token",
				Value:    *token,
				Expires:  time.Now().Add(time.Hour * 24),
				HttpOnly: true,
			})
		}

		utils.RespondWithSuccess(w, http.StatusAccepted, response)

	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}
