
## NODE VERSION

### v24.5.0


## DOCKER

### docker дээр kafka ажиллаж байгаа.

- docker-compose -p easystem up    —-> start containers and attach logs
- docker-compose -p easystem up -d —-> start containers in background
- docker-compose down
- docker-compose logs


## DEV
- npm install
- npm run start:dev
- npm run build


## Authentication

Ашигласан линк:
https://docs.nestjs.com/security/authentication

### Add User

http://localhost:4000/users/register
- curl -X POST http://localhost:4000/users/register -d '{"name": "user1", "password": "123"}' -H "Content-Type: application/json"

### Login

- curl http://localhost:4000/auth/profile
- curl -X POST http://localhost:4000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"
- curl http://localhost:4000/auth/profile -H "Authorization: Bearer ..."



## Database

Ашигласан линк:
https://docs.nestjs.com/techniques/mongodb

- Mongoose


## Local backend to INTERNET

Ngrok
- npm install -g ngrok
- ngrok config add-authtoken 32lxSZpULp7k1k2tlr2L6ARj1yS_3nvSdsdfv1Wo9mzCmTTgw
- pkill ngrok
- # ngrok http 4000
- # ngrok start --config ngrok.yml api



### Add User to MONGODB

```sh
    - mongosh
    - use eas-db

    - db.createUser({ user: "admin", pwd: "P@ss!23456", roles: [ { role: "readWrite", db: "eas-db" }] })
```