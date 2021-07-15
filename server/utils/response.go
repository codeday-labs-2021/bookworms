package utils

import (
	"encoding/json"
	"net/http"
	"time"
)

type errorResp struct {
	Success   bool   `json:"success"`
	Message   string `json:"message"`
	TimeStamp int64  `json:"time_stamp"`
}

type successResp struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data"`
	TimeStamp int64       `json:"time_stamp"`
}

// Reusable err response function
func RespondWithError(w http.ResponseWriter, message string, status int) {
	response := errorResp{
		Message:   message,
		TimeStamp: time.Now().UnixNano() / int64(time.Millisecond),
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(response)
}

// Reusable success response function
func RespondWithSuccess(w http.ResponseWriter, status int, data interface{}) {
	response := successResp{
		Success:   true,
		Data:      data,
		TimeStamp: time.Now().UnixNano() / int64(time.Millisecond),
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
