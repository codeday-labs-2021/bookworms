Bookworms API
=============

API server for bookworms web app written in Go and hosted on Vercel as serverless functions.

## Prerequisite

Vercel cli must be installed for local development.

```bash
$ npm install -g vercel
```

## Development

For local development, you need to first register a Vercel account and create a new project with an environment variable `MONGODB_URI`. Then link the project you created to this directory when running follow command:

```bash
$ vercel dev
```

If everything is OK, you should be able to access API at http://localhost:3000/api/ping.

## References:

- [What are serverless functions?](https://vercel.com/docs/serverless-functions/introduction)
- [Vercel Go Runtime](https://vercel.com/docs/runtimes#official-runtimes/go)
- [Mongodb Go Driver](https://github.com/mongodb/mongo-go-driver)
