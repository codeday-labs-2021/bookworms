package utils

import (
	"net/http"
)

func HandleCors(w *http.ResponseWriter, r *http.Request, allowedMethods string) {
	switch origin := r.Header.Get("Origin"); origin {
	case "http://localhost:3000", "https://codeday-labs.github.io":
		(*w).Header().Set("Access-Control-Allow-Origin", origin)
	}
	(*w).Header().Set("Access-Control-Allow-Methods", allowedMethods)
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding")
	(*w).Header().Set("Access-Control-Max-Age", "3600")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
}
