Bookworms
=========

Bookworms is a CodeDay Labs project to create a web app to share your ideas of a book with others.

[![Deploy client to github pages](https://github.com/jeromewu/bookworms/actions/workflows/client.yml/badge.svg?branch=main)](https://github.com/jeromewu/bookworms/actions/workflows/client.yml)
[![Deploy server to Vercel](https://github.com/jeromewu/bookworms/actions/workflows/server.yml/badge.svg?branch=main)](https://github.com/jeromewu/bookworms/actions/workflows/server.yml)

## Installation

Check [client](./client) and [server](./server) for how to install them.

## Self-hosting

If you clone / fork this project and want to host it on your own, few configuration you need to do in advance.

### Github Secrets

Following secrets you need to add to your [Github Secrets](https://docs.github.com/en/actions/reference/encrypted-secrets) to make it work using Github Actions.

| Name | Description |
| ---- | ----------- |
| VERCEL_TOKEN | vercel token |
| VERCEL_PROJECT_ID | vercel project id |
| VERCEL_ORG_ID | vercel org id |

> For details, check here: https://github.com/marketplace/actions/vercel-action

### Vercel Environment Variables

In your linked Vercel project, following environment variable must be added:

| Name | Description |
| ---- | ----------- |
| MONGODB_URI | mongodb uri, ex: mongodb+srv://root:password@example.mongodb.net/bookworms?retryWrites=true&w=majority |

## Contributors

- [Dan Khanh (Aurora) V.](https://www.linkedin.com/in/aurora-vo/)
- [Jerome Wu](https://www.linkedin.com/in/wenchiehwu/)
- [Makuza Mugabo verite](https://www.linkedin.com/in/makuza-mugabo-verite-99369a184/)
