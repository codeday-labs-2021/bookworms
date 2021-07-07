package db

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Review struct {
	ID         primitive.ObjectID `bson:"_id"`
	Names      string             `bson:"names"`
	BookName   string             `bson:"book_name"`
	BookReview float32            `bson:"book_review"`
	CreatedAt  time.Time          `bson:"created_at"`
	UpdatedAt  time.Time          `bson:"updated_at"`
}
