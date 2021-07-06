package handler

import (
	"fmt"
	"net/http"
)

func Ping(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "<h1>%v %v: Hello Bookworms!</h1>", r.Method, r.URL)
}
