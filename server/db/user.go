package db

import "go.mongodb.org/mongo-driver/bson/primitive"

var UserCollection = "user"

type User struct {
	ID        primitive.ObjectID `bson:"_id" json:"id"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"password"`
	UserName  string             `bson:"user_name" json:"user_name"`
	CreatedAt string             `bson:"created_at" json:"created_at"`
	UpdatedAt string             `bson:"updated_at" json:"updated_at"`
}
