const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

exports.createTransporter = async () => {
  const myOAuth2Client = new OAuth2(
    "743800966740-v90gbc6ltd3hm56ndh5ni32hc3l0uqp7.apps.googleusercontent.com",
    "xf9ijHAX_ZBupYsyCxiFiKNs",
    "https://developers.google.com/oauthplayground"
  );
  myOAuth2Client.setCredentials({
    refresh_token: '1//044g83ZXpbDxQCgYIARAAGAQSNwF-L9IrbxH1lnhjXSWAyu0FuMwKyxHKJWg3nagfhIHuuwivWJ8D-ZKJvZIyzMg4tVrP9LSoyvI'
  });
  const accessToken = await new Promise((resolve, reject) => {
    myOAuth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
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
      refreshToken: '1//044g83ZXpbDxQCgYIARAAGAQSNwF-L9IrbxH1lnhjXSWAyu0FuMwKyxHKJWg3nagfhIHuuwivWJ8D-ZKJvZIyzMg4tVrP9LSoyvI',
      accessToken
    }
  });
  return transporter;
}