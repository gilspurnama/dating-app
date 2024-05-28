# Dating App

This dating app is a Node.js, Typescript, Express, MongoDB, and REST API project that was designed to serve as learning platform for these tech stack
with the approach of creating a dating app.

## Features

- User authorization and authentication using Session-Token
- Password hashing for secure storage
- Custom error handler for convenient error handling
- Custom logging handler for better logging

## Prerequisites

Node.js v14.x or later MongoDB v7.x or later Typescript v5.x or later

# Getting Started

## Clone the repository

```
git clone https://github.com/gilspurnama/dating-app.git
cd dating-app
```

## Connect to DB

If already have MongoDB, change

```
// .ENV

DB_CONN_STRING='mongodb://<URL>:<port>/<DB>'
```

## Install dependencies

```
npm install
```

## Build the application

```
npm run Build
```

## Run the application

```
npm run start
```

## Lint the project's code

```
npm run lint
```

## Prettify the project's code

```
npm run prettify
```

## Set up dummy data

to set up dummy data, execute POST /users/dummy/ it will insert all data inside `/src/utils/dummyData.ts` NOTE: when execute the API, wait about 2-5
seconds and then just stop the process. The data will be successfully added, but there is still error in the API still loading.

# Service Structure

## Project Structure

Inside the project, we group each file according to its purpose

```bash
├── src
|   ├── config
|   |   ├── config.ts
|   |   ├── errorHandler.ts
|   |   └── logging.ts
|   ├── controller
|   |   ├── authController.ts
|   |   ├── messageController.ts
|   |   └── userController.ts
|   ├── db
|   |   ├── message.ts
|   |   └── user.ts
|   ├── middleware
|   |   ├── authHandler.ts
|   |   ├── corsHandler.ts
|   |   └── loggingHandler.ts
|   ├── routers
|   |   ├── authRoutes.ts
|   |   ├── messageRutes.ts
|   |   ├── userRoutes.ts
|   |   └── index.ts
|   ├── services
|   |   ├── authService.ts
|   |   ├── messageService.ts
|   |   └── userService.ts
|   ├── utils
|   |   ├── constant.ts
|   |   ├── dummyData.ts
|   |   └── index.ts
|   └── server.ts
├── .ENV
├── .gitignore
├── .prettierrc
├── package-lock.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

`config` directory is for storing configuration files like error handling and logging configuration.

`controller` Responsible for receiving & returning data to routes.

`db` store the data schema for each collections.

`middleware` directory is for intercepting something.

`routers` is for REST API routes.

`services` is for core business logic.

`util` is to stored utilities needed.

## Databse Structure

### User Schema

```
email: { type: String, required: true, select: false },
firstName: { type: String },
lastName: { type: String },
gender: { type: String },
bio: { type: String },
passions: { type: String },
preferredGender: { type: String },
swipes: { type: Number },
dailySwipe: { type: Number },
dailySwipeUpdatedAt: { type: Date },
verified: { type: Boolean },
authentication: {
password: { type: String, required: true, select: false },
salt: { type: String, select: false },
sessionToken: { type: String, select: false }
},
subscription: {
name: { type: String, select: false },
id: { type: String, select: false }
},
matches: {
type: Array,
items: {
    type: Object,
    properties: {
    id: { type: String, select: false },
    updatedAt: { type: Date, select: false }
    }
}
},
unmatches: {
type: Array,
items: {
    type: Object,
    properties: {
    id: { type: String, select: false },
    updatedAt: { type: Date, select: false }
    }
}
}
```

### Message Schema

```
timestamp: { type: Date },
fromUserId: { type: String },
toUserId: { type: String },
message: { type: String }
```
