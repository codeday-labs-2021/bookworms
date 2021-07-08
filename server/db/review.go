package db

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Review struct {
	ID             primitive.ObjectID `bson:"_id"`
	Names          string             `bson:"names"`
	BookName       string             `bson:"book_name"`
	BookReview     string             `bson:"book_review"`
	BookCategories string             `bson:"book_categories"`
	CreatedAt      time.Time          `bson:"created_at"`
	UpdatedAt      time.Time          `bson:"updated_at"`
}
