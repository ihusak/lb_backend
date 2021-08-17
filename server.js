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
const cron = require('./backend/config/cron');
const {errorLogger} = require('./backend/config/middleware/logger')

if(!process.env.MONGODB_URI) {
  var corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
  app.use(cors(corsOptions))
}
console.log('DB_URI', DB_URL);

app.use('/uploads/avatars', express.static(path.resolve(__dirname + '/uploads/avatars')));
app.use('/translate', express.static(path.join(__dirname + '/backend/translate')));
app.use('/static', express.static(path.resolve(__dirname + '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

process.on('uncaughtException', function (err) {
  errorLogger.error(`Node error ${err}`)
});

cron.deleteExpiredToken.start();
     
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
      app.use('/payments', require('./backend/routes/payments/payments'));
      app.use('/homeworks', require('./backend/routes/homeworks/homeworks'));
      app.use('/recovery', require('./backend/routes/recovery-pass/recovery'));
      app.use('/notify', require('./backend/routes/notify/notify'));
      app.use('/videos', require('./backend/routes/videos/videos'));
      app.use('/shop', require('./backend/routes/shop/shop'));
      app.use(errorHandler);
  });
});
