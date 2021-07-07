package handler

import (
	"fmt"
	"net/http"
	"os"
)

func Review(w http.ResponseWriter, r *http.Request) {
	fmt.Println(os.Getenv("MONGODB_URI"))
}
