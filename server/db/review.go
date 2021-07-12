package db

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Review struct {
	ID         primitive.ObjectID `bson:"_id" json:"id"`
	UserName   string             `bson:"user_name" json:"user_name"`
	BookName   string             `bson:"book_name" json:"book_name"`
	Text       string             `bson:"text" json:"text"`
	Categories []string           `bson:"categories" json:"categories"`
	CreatedAt  time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt  time.Time          `bson:"updated_at" json:"updated_at"`
}
