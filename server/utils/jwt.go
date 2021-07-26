package utils

import (
	"errors"
	"net/http"
	"os"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/golang-jwt/jwt"
)

type Claims struct {
	User db.User
	jwt.StandardClaims
}

var Jwt_key = []byte(os.Getenv("JWT_SECRET"))

func GetUserFromCookie(r *http.Request) (*db.User, error) {
	cookie, err := r.Cookie("token")

	if err != nil {
		return nil, err
	}

	tokenValue := cookie.Value

	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenValue, claims, func(t *jwt.Token) (interface{}, error) {
		return Jwt_key, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("Invalid token!")
	}

	return &claims.User, nil
}
