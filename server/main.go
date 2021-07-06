package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if len(port) == 0 {
		port = "3000"
	}
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello Bookworms!"))
	})
	log.Printf("Running bookworms server at port %s", port)
	log.Fatalln(http.ListenAndServe(":"+port, nil))
}
