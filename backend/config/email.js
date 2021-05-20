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
    refresh_token: '1//0485DcXjSoChpCgYIARAAGAQSNwF-L9IrshC07kdLjWoBkp2Mt_BQ2_TH0Ow5ybV29dGckycYox7v7lB18XxI6TW-k93LQL5jI3Y'
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
      refreshToken: '1//0485DcXjSoChpCgYIARAAGAQSNwF-L9IrshC07kdLjWoBkp2Mt_BQ2_TH0Ow5ybV29dGckycYox7v7lB18XxI6TW-k93LQL5jI3Y',
      accessToken,
      expires: 1717987187825
    }
  });
  return transporter;
}