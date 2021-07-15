package handler

import (
	"log"
	"net/http"

	"github.com/codeday-labs/bookworms/server/utils"
)

func findAllCategoris() ([]string, error) {

	return nil, nil
}

func Categories(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		log.Println("here")
	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}
