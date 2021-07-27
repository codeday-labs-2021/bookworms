package db

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const ReviewsCollection string = "review"

type Review struct {
	ID         primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	UserID     primitive.ObjectID   `bson:"user_id,omitempty" json:"user_id"`
	BookName   string               `bson:"book_name,omitempty" json:"book_name"`
	Text       string               `bson:"text,omitempty" json:"text"`
	Categories []string             `bson:"categories,omitempty" json:"categories"`
	CreatedAt  time.Time            `bson:"created_at,omitempty" json:"created_at"`
	UpdatedAt  time.Time            `bson:"updated_at,omitempty" json:"updated_at"`
	Likes      []primitive.ObjectID `bson:"likes,omitempty" json:"likes"`
}
