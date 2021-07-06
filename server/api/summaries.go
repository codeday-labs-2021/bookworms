package handler

import (
	"fmt"
	"net/http"
	"os"
)

func Summaries(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for the preflight request
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Max-Age", "3600")
		w.WriteHeader(http.StatusNoContent)
		return
	}
	// Read URI from environment variable
	mongodbURI := os.Getenv("MONGODB_URI")
	if len(mongodbURI) == 0 {
		http.Error(w, "Mongodb URI is not defined, set MONGODB_URI in your Vercel Environment Variable", http.StatusInternalServerError)
		return
	}
	// Set CORS headers for the main request.
	w.Header().Set("Access-Control-Allow-Origin", "*")
	fmt.Fprintf(w, "<h1>%v %v: Hello Bookworms!</h1>", r.Method, r.URL)
}
