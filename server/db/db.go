package db

import (
	"context"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Ctx = context.TODO()

func DB() *mongo.Database {
	clientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URI"))

	client, err := mongo.Connect(Ctx, clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	//check for the connection
	err = client.Ping(Ctx, nil)

	if err != nil {
		log.Fatal(err)
	}

	//	defer client.Disconnect(Ctx)

	return client.Database("bookworms")
}
