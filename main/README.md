
## NESTJS

https://docs.nestjs.com/cli/overview
- npm install -g @nestjs/cli

- To create new Nest project.
    - nest new main
- cd main -> npm run start:dev



## Authentication

Ашигласан линк:
https://docs.nestjs.com/security/authentication

- curl http://localhost:4000/auth/profile
- curl -X POST http://localhost:4000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
- curl http://localhost:4000/auth/profile -H "Authorization: Bearer ..."



## Database

Ашигласан линк:
https://docs.nestjs.com/techniques/mongodb

- Mongoose

## Add User

http://localhost:4000/users/register
- curl -X POST http://localhost:4000/users/register -d '{"name": "user1", "password": "123"}' -H "Content-Type: application/json"


## Local backend to INTERNET

Ngrok
- npm install -g ngrok
- ngrok config add-authtoken 32lxSZpULp7k1k2tlr2L6ARj1yS_3nvSdsdfv1Wo9mzCmTTgw
- ngrok http 4000
    - Forwarding  https://random-subdomain.ngrok.io -> http://localhost:4000


## DOCKER

### docker дээр kafka ажиллаж байгаа.

- docker-compose up    —-> start containers and attach logs
- docker-compose up -d —-> start containers in background
- docker-compose down
- docker-compose logs
