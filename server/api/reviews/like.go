package reviews

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/codeday-labs/bookworms/server/db"
	"github.com/codeday-labs/bookworms/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func likeReview(id int) error {
	DB, err := db.DB()

	if err != nil {
		return err
	}

	fmt.Println("Reviews collection name " + ReviewsCollection)

	_, err = DB.Collection("review").UpdateOne(db.Ctx, bson.M{"id": id},
		bson.D{
			{"$inc", bson.D{{"likes", 1}}},
		}, options.Update().SetUpsert(true))

	if err != nil {
		return err
	}

	defer DB.Client().Disconnect(db.Ctx)
	return nil
}
func LikeHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":

		keys, err := r.URL.Query()["id"]

		if !err {
			utils.RespondWithError(w, "No id parsed", http.StatusBadRequest)
		}
		id, failedToParse := strconv.Atoi(keys[0])

		if failedToParse != nil {
			utils.RespondWithError(w, "Review id is wrong!", http.StatusBadRequest)
		}

		failed := likeReview(id)

		if failed != nil {
			utils.RespondWithError(w, "Failed to add like", http.StatusInternalServerError)
		}

	default:
		utils.RespondWithError(w, "Route not found!", http.StatusBadRequest)
	}

}
