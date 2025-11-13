
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

    - db.createUser({ user: "admin", pwd: "Pass123456", roles: [ { role: "readWrite", db: "eas-db" }] })
```


### MONGODB backup and restore

Install MongoDB Database Tools:

```sh
  brew install mongodb-database-tools
  mongodump --version
  mongorestore --version
```

Backup

```sh
  mongodump --uri="mongodb://admin:Pass123456@localhost:27017/eas-db" --out=/Users/admin/Desktop/backup/
  

```

Restore
```sh
  mongorestore --uri="mongodb://yourUsername:yourPassword@localhost:27017" /path/to/backup/
```

```sh
/mybrandname
├── /frontend
│   ├── /src
│   │   ├── /components        # UI Components (AuthForm, Navbar, etc.)
│   │   ├── /pages             # App pages (Home, Dashboard, Pricing)
│   │   ├── /hooks             # Custom React hooks (useAuth, useLogoGenerator)
│   │   ├── /lib               # Config files (Supabase, API client, constants)
│   │   ├── /styles            # Global and component styles
│   │   ├── App.tsx            # Main routing setup
│   │   └── main.tsx           # React entry point
│   ├── public/                # Public assets (icons, logos)
│   ├── tailwind.config.ts     # Configures Tailwind CSS settings
│   ├── vite.config.ts         # Contains build and development settings for the Vite bundler
│   └── package.json           # Lists frontend project dependencies, scripts, and metadata
│
├── /backend
│   ├── /src
│   │   ├── /routes            # Express routes (auth, brand, assets, subscription)
│   │   ├── server.ts          # Main Express server entry
│   │   └── config/            # Environment and DB configs
│   └── package.json           # Lists backend project dependencies, scripts, and metadata for Node.js
│
└── README.md
```


