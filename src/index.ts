import { MongoClient } from 'mongodb';

const express = require('express');
const body = require('body-parser');

async function start() {
  try {
    const app = express();

    const mongo = await MongoClient.connect('mongodb://0.0.0.0:27017/dating_app');

    await mongo.connect();

    app.db = mongo.db();

    // body parser

    app.use(
      body.json({
        limit: '500kb'
      })
    );

    // Routes

    app.use('/users', require('./routes/users'));

    // Start server

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.log(error);
  }
}

start();
