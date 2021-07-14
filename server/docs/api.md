API Design
==========

- [GET /ping](#get-ping)
- [POST /api/reviews](#post-apireviews)
- [GET /api/reviews](#get-apireviews)
- [POST /api/like](#post-apilike)
- [GET /api/filter](#get-apifilter)

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

### POST /api/reviews

**Example Request**

```
$ curl -d '{
    "text":"I'm sure everyone has their own childhood memories of reading the Harry Potter books that they'll tell their grandkids about, but I'll never forget going to see the first movie in the theaters",
    "book_name":"Harry Potter",
    "user_name":"test_user",
    "categories":["Animals","Plantation"] 
}' -H 'Content-Type: application/json' -x POST https://bookworms-api.vercel.app/api/reviews 

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

### POST /api/like

**Example Request**


```

$ curl -d '
{
    "review_id": "60eec6d2054f49d2c58d3390"
}
' -H 'Content-Type: application/json' -x POST https://bookworms-api.vercel.app/api/like 

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

### GET /api/filter

**Example Request**

```
$ curl https://bookworms-api.vercel.app/api/filter\?categories\=Plantation 

```

**Example Response**

```
200 OK

{
    "success": true,
    "data": [
        {
            "id": "60eec68824137a1bad0f5930",
            "user_name": "test_user",
            "book_name": "Harry Potter",
            "text": "I'm sure everyone has their own childhood memories of reading the Harry Potter books that they'll tell their grandkids about, but I'll never forget going to see the first movie in the theaters",
            "categories": [
                "Plantation"
            ],
            "created_at": "2021-07-14T11:12:08.792Z",
            "updated_at": "2021-07-14T11:12:08.792Z",
            "likes": 0
        },
        {
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
        }
    ],
    "time_stamp": "Wed Jul 14 13:27:28 +0200 2021"
}
```
