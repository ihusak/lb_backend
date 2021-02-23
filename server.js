const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./backend/config/db');
const config = require('./config.json')
const cors = require('cors');
const PORT = 3000;
const DB_URL = config.url_local;
const errorHandler = require('./backend/config/error-handler');
const cookieParser = require('cookie-parser');
const path = require('path');

if(!process.env.MONGODB_URI) {
  var corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
  app.use(cors(corsOptions))
} else {
  // var corsProdOptions = {
  //   origin: `http://lb.afreestylers.com`,
  //   credentials: true,
  //   optionsSuccessStatus: 200,
  //   methods: 'GET,PUT,POST,DELETE,OPTIONS'
  // };
  // app.use(cors(corsProdOptions));
  app.use(function(req, res, next) {
    console.log('cross origin prod');
    res.header("Access-Control-Allow-Origin", 'https://lb.afreestylers.com');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json, Authorization');
    next();
});
}
console.log('DB_URI', DB_URL);
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/translate', express.static(path.join(__dirname + '/backend/translate')));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
     
// MONGOOSE
db.connect(DB_URL, (err) => {
  if(err) return console.log(err);
  app.listen(PORT, function(){
    console.log(`Server connected and listen posrt ${PORT}`);
      app.use('/users', require('./backend/routes/users/users'));
      app.use('/roles', require('./backend/routes/roles/roles'));
      app.use('/userInfo', require('./backend/routes/userInfo/userInfo'));
      app.use('/task', require('./backend/routes/task/task'));
      app.use('/courses', require('./backend/routes/courses/courses'));
      app.use('/uploadImage', require('./backend/routes/files/files'));
      app.use(errorHandler);
  });
});
