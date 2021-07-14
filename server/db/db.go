package db

import (
	"context"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Ctx = context.TODO()

func DB() (*mongo.Database, error) {
	clientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URI"))

	client, _ := mongo.Connect(Ctx, clientOptions)

	//check for the connection
	err := client.Ping(Ctx, nil)

	if err != nil {
		return nil, err
	}

	//	defer client.Disconnect(Ctx)
	return client.Database("bookworms"), nil
}
