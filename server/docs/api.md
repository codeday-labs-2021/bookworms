API Design
==========

- [GET /ping](#get-ping)
- [POST /api/reviews](#post-api-reviews)
- [GET /api/reviews](#get-api-reviews)

### GET /ping

**Example Request**

```
$ curl -H "Accept: application/json" -H "Content-Type: application/json" https://bookworms-api.vercel.app/api/ping
```

**Example Response**

```
200 OK

{ "status": "ok" }
```




### GET /api/reviews

**Example Request**

```
$ curl -H "Accept: application/json" -H "Content-Type: application/json" https://bookworms-api.vercel.app/api/reviews

```

**Example Response**

```
200 OK


[
 {
    "id": "60e99b85759604b8965e7f35",
    "user_name": "test_user",
    "book_name": "Harry Potter",
    "text": "I'm sure everyone has their own childhood memories of reading the Harry Potter books that they'll tell their grandkids about, but I'll never forget going to see the first movie in the theaters",
    "categories": [
      "Animals",
      "Plantation"
    ],
    "created_at": "2021-07-10T13:07:17.242Z",
    "updated_at": "2021-07-10T13:07:17.242Z"
 }
]
```

### POST /api/reviews

**Example Request**

```
$ curl -d '{
    "text":"I'm sure everyone has their own childhood memories of reading the Harry Potter books that they'll tell their grandkids about, but I'll never forget going to see the first movie in the theaters",
    "book_name":"Harry Potter",
    "user_name":"test_user",
    "categories":["Animals","Plantation"] 
}' -H 'Content-Type: application/json' https://bookworms-api.vercel.app/api/reviews 

```

**Example Response**

```
201 OK

{
 "id": "60e99b85759604b8965e7f35",
 "user_name": "test_user",
 "book_name": "Harry Potter",
 "text": "I'm sure everyone has their own childhood memories of reading the Harry Potter books that they'll tell their grandkids about, but I'll never forget going to see the first movie in the theaters",
 "categories": [
        "Animals",
        "Plantation"
 ],
 "created_at": "2021-07-10T15:07:17.2424397+02:00",
 "updated_at": "2021-07-10T15:07:17.2424413+02:00"
}
```
