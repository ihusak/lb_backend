const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const db = require('./backend/config/db');
// const dbName = 'librarytricks_db'; //compass
const dbName = 'librarytricks'; // web
const cors = require('cors')

var corsOptions = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({ extended: true }));

const port = 8000;
// connect to web cluster
const client = new MongoClient(db.url, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
  if (err) return console.log(err);
  console.log('database!!!!: ', client);
  require('./backend/routes')(app, client.db(dbName));
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})

// connect to localhost
// MongoClient.connect(db.url, (err, database) => {
//   if (err) return console.log(err);
//   console.log('database!!!!: ', database);
//   require('./backend/routes')(app, database.db(dbName));
//   app.listen(port, () => {
//     console.log('We are live on ' + port);
//   });               
// })