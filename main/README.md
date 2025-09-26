
## NODE VERSION

### v24.5.0



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
- ngrok http 4000
  ngrok http 4000 --log=ngrok.log --log-format=json
  ngrok http 4000 --log=stdout --log-format=logfmt
  ngrok http 4000 --log=stdout --log-format=json
    - Forwarding  https://random-subdomain.ngrok.io -> http://localhost:4000


## DOCKER

### docker дээр kafka ажиллаж байгаа.

- docker-compose -p easystem up    —-> start containers and attach logs
- docker-compose -p easystem up -d —-> start containers in background
- docker-compose down
- docker-compose logs
