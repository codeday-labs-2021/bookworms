package handler

import (
	"net/http"
	"strings"

	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
)

func FilterHandler(w http.ResponseWriter, r *http.Request) {
	utils.HandleCors(&w, r, "GET")
	switch r.Method {
	case "GET":

		query := r.URL.Query().Get("categories")

		if len(query) == 0 {
			utils.RespondWithError(w, "Filter query must be specified", http.StatusBadRequest)
			return
		}
		searchQuery := strings.Split(query, ",")
		reviews, err := utils.FilterReviews(bson.M{"categories": bson.M{"$in": searchQuery}})

		if err != nil {
			utils.RespondWithError(w, "Failed to search!", http.StatusInternalServerError)
			return
		}

		utils.RespondWithSuccess(w, http.StatusOK, reviews)

	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}
}
