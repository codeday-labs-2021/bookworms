package utils

import (
	"net/http"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/golang-jwt/jwt"
)

type Claims struct {
	User db.User
	jwt.StandardClaims
}

var Jwt_key = []byte("kdksksm2039")

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
		return nil, err
	}

	return &claims.User, nil
}
