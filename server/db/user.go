package db

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

var UserCollection = "user"

type User struct {
	ID        primitive.ObjectID `bson:"_id" json:"id"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"password"`
	Names     string             `bson:"names" json:"names"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}
