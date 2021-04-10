const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const {mailTransporterLogger} = require('../config/middleware/logger');
const OAuth2 = google.auth.OAuth2;

exports.createTransporter = async () => {
  const myOAuth2Client = new OAuth2(
    "743800966740-v90gbc6ltd3hm56ndh5ni32hc3l0uqp7.apps.googleusercontent.com",
    "xf9ijHAX_ZBupYsyCxiFiKNs",
    "https://developers.google.com/oauthplayground",
    {forceRefreshOnFailure: true}
  );
  myOAuth2Client.setCredentials({
    refresh_token: '1//04H8tKW6OyW5WCgYIARAAGAQSNwF-L9IreIXWFHj6EoGy2PKPYlGmYEp4YOSSheVifae9ztWKgLg3WfKVkasg3qju5QhJ1J25dHY'
  });
  const accessToken = await new Promise((resolve, reject) => {
    myOAuth2Client.getAccessToken((err, token) => {
      if (err) {
        mailTransporterLogger.info('GetAccessTokenErr', err);
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  }).catch((err) => {
    mailTransporterLogger.info('GetAccessTokenErr catch', err);
  });
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: 'afreestylers2016@gmail.com',
      clientId: '743800966740-v90gbc6ltd3hm56ndh5ni32hc3l0uqp7.apps.googleusercontent.com',
      clientSecret: 'xf9ijHAX_ZBupYsyCxiFiKNs',
      refreshToken: '1//04H8tKW6OyW5WCgYIARAAGAQSNwF-L9IreIXWFHj6EoGy2PKPYlGmYEp4YOSSheVifae9ztWKgLg3WfKVkasg3qju5QhJ1J25dHY',
      accessToken,
      expires: 1717987187825
    }
  });
  return transporter;
}