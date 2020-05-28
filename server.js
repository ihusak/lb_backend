const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const db = require('./backend/config/db');
const config = require('./config.json')
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const DB_URL = process.env.MONGODB_URI || config.url_local;
const routes = require('./backend/routes');

const userController = require('./backend/controllers/users');

if(!process.env.MONGODB_URI) {
  var corsOptions = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
  app.use(cors(corsOptions))
}
app.use(bodyParser.urlencoded({ extended: true }));

// MONGOOSE
db.connect(DB_URL, (err) => {
  if(err) return console.log(err);
  app.listen(PORT, function(){
      console.log(`Server connected and listen posrt ${PORT}`);
      routes(app, userController);
  });
});

// dbConnection.on('error', (err) => console.log('Connect error', err));
// dbConnection.once('open', () => {
//   console.log('CONNECT');
// })
// connect to localhost
// MongoClient.connect(DB_URL, (err, database) => {
//   if (err) return console.log(err);
//   require('./backend/routes')(app, database.db(dbName));              
// }) 