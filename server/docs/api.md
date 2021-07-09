API Design
==========

- [GET /ping](#get-ping)
- [POST /api/reviews](#post-reviews)
- [GET /api/reviews](#get-reviews)

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
  "_id": "000000000000000000000000",
  "names": "",
  "book_name": "Bible",
  "book_review": "This is an amazing book everybody can have",
  "book_categories": "religious",
  "created_at": "0001-01-01T00:00:00Z",
  "updated_at": "0001-01-01T00:00:00Z"
  },
 {
  "_id": "60e6e312659b4cfc5bed43af",
  "names": "John doe",
  "book_name": "Bible",
  "book_review": "This is an amazing book everybody can have",
  "book_categories": "religious",
  "created_at": "2021-07-08T11:35:46.692Z",
  "updated_at": "2021-07-08T11:35:46.692Z"
 }
]
```




### POST /api/reviews

**Example Request**

```
$ curl -d '{
    "names":"John doe",
    "book_name":"Bible",
    "book_review":"This is an amazing book everybody can have",
    "categories":"religious"
}' -H 'Content-Type: application/json' https://bookworms-api.vercel.app/api/reviews 

```

**Example Response**

```
201 OK

{
    "_id": "60e70c87220511241fcdda39",
    "names": "John doe",
    "book_name": "Bible",
    "book_review": "This is an amazing book everybody can have",
    "book_categories": "religious",
    "created_at": "2021-07-08T16:32:39.0067414+02:00",
    "updated_at": "2021-07-08T16:32:39.0067416+02:00"
}
```
