package handler

import (
	"net/http"

	"github.com/codeday-labs/bookworms/server/utils"
)

func ReviewHandler(w http.ResponseWriter, r *http.Request) {
	utils.HandleCors(&w, "GET")
	switch r.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)
	default:
		utils.RespondWithError(w, "Route not found!", http.StatusOK)
	}
}
