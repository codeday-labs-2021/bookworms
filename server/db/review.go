package db

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Review struct {
	ID             primitive.ObjectID `bson:"_id" json:"_id"`
	Names          string             `bson:"names" json:"names"`
	BookName       string             `bson:"book_name" json:"book_name"`
	BookReview     string             `bson:"book_review" json:"book_review"`
	BookCategories string             `bson:"book_categories" json:"book_categories"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt      time.Time          `bson:"updated_at" json:"updated_at"`
}
