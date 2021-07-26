API Design
==========

- [GET /ping](#get-ping)
- [POST /api/reviews](#post-apireviews)
- [GET /api/reviews](#get-apireviews)
- [POST /api/like](#post-apilike)
- [GET /api/categories](#get-apicategories)
- [POST /api/signin](#post-apisignin)
- [POST /api/signup](#post-apisignup)
- [DELETE /api/reviews/:id](#delete-apideleteid)

### GET /ping

**Example Request**

```
$ curl -H "Accept: application/json" https://bookworms-api.vercel.app/api/ping
```

**Example Response**

```
200 OK

{ "status": "ok" }
```




### GET /api/reviews


This api does three things

- Get all reviews (By default are arranged in descending order of the date they were created meaning the most recent comes first)
- Get all reviews with a partular keyword in review body(text) 
- Get reviews  ordered by likes(use `likes` in request) , books names(use `book_name`) or recency (use `created_at`)
- Filter reviews by categories
- All those operations can also happen in single api call

**Example Request**

```
$ curl -H "Accept: application/json" https://bookworms-api.vercel.app/api/reviews

```

**Example Response**

```
200 OK


{
    "success": true,
    "data": [
        {
            "id": "60ebe58329dc4addabf50b2c",
            "user_name": "test_user",
            "book_name": "Harry Potter",
            "text": "I'm sure everyone has their own childhood memories of reading the Harry Potter books that they'll tell their grandkids about, but I'll never forget going to see the first movie in the theaters",
            "categories": [
                "Animals",
                "Plantation"
            ],
            "created_at": "2021-07-12T06:47:31.067Z",
            "updated_at": "2021-07-12T06:47:31.067Z"
        }
    ]
}
```

- If you would like to return sorted result according to populality likes

```
$ curl -H "Accept: application/json" https://bookworms-api.vercel.app/api/reviews?sort=likes&sortOrder=-1

```

This means that the api will sort by likes(populality) in descending order


   - They are two sorting orders
   - (-1) for ascending order
   - (1) for descending order

  If you skip the sorting order the api will yell at you!

This will return data in ascending order based on names.

```
$ curl -H "Accept: application/json" https://bookworms-api.vercel.app/api/reviews?sort=book_name&sortOrder=1

```

This will return book reviews sorting in ascending order of the booknames(A-Z)


To enable search you need to todo it this way
```
$ curl -H "Accept: application/json" https://bookworms-api.vercel.app/api/reviews?search=Keyword here

```

To do sort and search at the sametime do

```
$ curl -H "Accept: application/json" https://bookworms-api.vercel.app/api/reviews?search=Keyword here&sort=likes&sortOrder=1

```


This will return data in descending order based on likes

- If you would like to filter the following can be used

```
$ curl -H "Accept: application/json" https://bookworms-api.vercel.app/api/reviews\?categories\=plantation 

```

You can also pass two or more variable just make sure to separate with commas

```
$ curl -H "Accept: application/json" https://bookworms-api.vercel.app/api/reviews\?categories\=plantation,Animals 

```

### POST /api/reviews

**Example Request**

```
$ curl --location --request POST 'https://bookworms-api.vercel.app/api/reviews' \
--header 'Content-Type: application/json' \
--header 'Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjp7ImlkIjoiNjBmZTkzZDljZjRiMDQwMjYxMGMyNWNjIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicGFzc3dvcmQiOiIkMmEkMTQkbzJFOElRM3pja256aS9WbDZiMnh6dXVseHpWT05LMlphekREZkxQLlVubjJHM1lHTHhZNjYiLCJuYW1lIjoidGVzdCIsImNyZWF0ZWRfYXQiOiIyMDIxLTA3LTI2VDEwOjUyOjEwLjc4NVoiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNy0yNlQxMDo1MjoxMC43ODVaIn0sImV4cCI6MTYyNzM4NDQyMH0.6NnP7Nd8GTFTmy4z0glW50MjqyzJXZxjHOBldnZNj3w' \
--data-raw '{
    "book_name": "Harry Potter",
    "text": "I'\''m sure everyone has their own childhood memories of reading the Harry Potter books that they'\''ll tell their grandkids about, but I'\''ll never forget going to see the first movie in the theaters",
    "categories": [
        "Animals",
        "Plantation"
    ]
}'

```

**Example Response**

```
201 OK

{
    "success": true,
    "data": {
        "id": "60ebe58329dc4addabf50b2c",
        "user_name": "test_user",
        "book_name": "Harry Potter",
        "text": "I'm sure everyone has their own childhood memories of reading the Harry Potter books that they'll tell their grandkids about, but I'll never forget going to see the first movie in the theaters",
        "categories": [
            "Animals",
            "Plantation"
        ],
        "created_at": "2021-07-12T08:47:31.0672556+02:00",
        "updated_at": "2021-07-12T08:47:31.0672571+02:00"
    }
}
```


### POST /api/like/:reviewID

**Example Request**


```

$ curl --location --request POST 'localhost:3000/api/like/60feb9f8d31aa9f9e4ef23e4' \
--header 'Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjp7ImlkIjoiNjBmZTkzZDljZjRiMDQwMjYxMGMyNWNjIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicGFzc3dvcmQiOiIkMmEkMTQkbzJFOElRM3pja256aS9WbDZiMnh6dXVseHpWT05LMlphekREZkxQLlVubjJHM1lHTHhZNjYiLCJuYW1lIjoidGVzdCIsImNyZWF0ZWRfYXQiOiIyMDIxLTA3LTI2VDEwOjUyOjEwLjc4NVoiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNy0yNlQxMDo1MjoxMC43ODVaIn0sImV4cCI6MTYyNzM4NDQyMH0.6NnP7Nd8GTFTmy4z0glW50MjqyzJXZxjHOBldnZNj3w' 

```

**Example Response**

```
201 OK


{
    "success": true,
    "data": {
        "id": "60eec6d2054f49d2c58d3390",
        "user_name": "test_user",
        "book_name": "Harry Potter",
        "text": "I'm sure everyone has their own childhood memories of reading the Harry Potter books that they'll tell their grandkids about, but I'll never forget going to see the first movie in the theaters",
        "categories": [
            "Animals",
            "Plantation"
        ],
        "created_at": "2021-07-14T11:13:22.619Z",
        "updated_at": "2021-07-14T11:13:22.619Z",
        "likes": 1
    },
    "time_stamp": "Wed Jul 14 13:14:23 +0200 2021"
}
```
To unlike is to call the same api for like! 


### GET /api/categories


**Example Request**

```
$ curl -H "Accept: application/json" https://bookworms-api.vercel.app/api/categories
```


**Example Response**
```
{
  "success": true,
  "data": [
      "Animals",
      "Drama",
      "Fantasy",
      "Fiction",
      "History",
      "Horror",
      "Literature",
      "Mystery",
      "Nonfiction",
      "Plantation",
      "Romance",
      "Sci-Fi",
       "Science"
  ],
  "time_stamp": 1626953710816
}
```

### POST /api/signup


**Example Request**

```
$ curl --location --request POST 'https://bookworms-api.vercel.app/api/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name":"test",
    "email":"test@test.com",
    "password":"123456"
}' 
```


**Example Response**
```
201 ok

{
    "success": true,
    "data": {
        "names": "test",
        "email": "user@gmail.com",
        "created_at": 1627117527701,
        "updated_at": 1627117527701
    },
    "time_stamp": 1627117528559
}
```

### POST /api/signin


**Example Request**

```
$ curl --location --request POST 'https://bookworms-api.vercel.app/api/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"user@gmail.com",
    "password":"12345"
}'
```


**Example Response**
```
200 ok

{
    "success": true,
    "data": {
        "message": true
    },
    "time_stamp": 1627132610917
}
```


### DELETE /api/reviews/:id

**Example Request**

```
$ curl --location --request DELETE 'https://bookworms-api.vercel.app/api/reviews/60feb2279d2d5eb2d830112b' \
--header 'Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjp7ImlkIjoiNjBmZTkzZDljZjRiMDQwMjYxMGMyNWNjIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicGFzc3dvcmQiOiIkMmEkMTQkbzJFOElRM3pja256aS9WbDZiMnh6dXVseHpWT05LMlphekREZkxQLlVubjJHM1lHTHhZNjYiLCJuYW1lIjoidGVzdCIsImNyZWF0ZWRfYXQiOiIyMDIxLTA3LTI2VDEwOjUyOjEwLjc4NVoiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNy0yNlQxMDo1MjoxMC43ODVaIn0sImV4cCI6MTYyNzM4NDQyMH0.6NnP7Nd8GTFTmy4z0glW50MjqyzJXZxjHOBldnZNj3w' 

```

**Example Response**

```
200 OK

{
    "success": true,
    "data": null,
    "time_stamp": 1627304512354
}
```
