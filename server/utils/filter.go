package utils

import (
	"strings"

	"github.com/codeday-labs/bookworms/server/db"
)

const ReviewsCollection string = "review"

func RemoveDuplicates(arraySlice []string) []string {
	keys := make(map[string]bool)
	list := []string{}

	var sliceLowerCase []string

	for _, entry := range arraySlice {
		sliceLowerCase = append(sliceLowerCase, strings.Trim(strings.ToLower(entry), " "))
	}

	for _, entry := range sliceLowerCase {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, strings.Title(entry))
		}
	}
	return SortASC(list)
}

func SortASC(a []string) []string {
	for i := 0; i < len(a)-1; i++ {
		for j := i + 1; j < len(a); j++ {
			if strings.Compare(a[i], a[j]) > 0 {
				temp := a[i]
				a[i] = a[j]
				a[j] = temp
			}
		}
	}
	return a
}

//FilterReviews based on filter passed
func FilterReviews(filter interface{}) ([]*db.Review, error) {

	// a slice to store decoded reviews
	var reviews []*db.Review

	DB, err := db.DB()

	// close db connection
	defer DB.Client().Disconnect(db.Ctx)

	if err != nil {
		return nil, err
	}

	cur, err := DB.Collection(ReviewsCollection).Find(db.Ctx, filter)

	// once once done iterating the cursor close
	defer cur.Close(db.Ctx)

	if err != nil {
		return reviews, err
	}

	// Iterate over a returned cursor and decode each at a time

	for cur.Next(db.Ctx) {
		var r db.Review
		err := cur.Decode(&r)
		if err != nil {
			return reviews, err
		}

		reviews = append(reviews, &r)
	}

	if err := cur.Err(); err != nil {
		return reviews, err
	}

	return reviews, nil
}
