const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const config = require("../../config.json");
const {mailTransporterLogger} = require('../config/middleware/logger');
const OAuth2 = google.auth.OAuth2;
const fetch = require("node-fetch");
const code = '4/0AY0e-g5CMy8Wb34IkdcyAsD6O9Jf1ORMiyr1tl9MAEFgk02HKKpf3bC6NuhsUrvXt14JPg';
const REFRESH_TOKEN = '1//04vbBUFVhnSDKCgYIARAAGAQSNwF-L9IrgZKxArVXASq1ZN_4o057B9_gKGaam6wd7X5mcOH2VTZzKvQEphsylodHMErsNN-mD9M';
// const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

exports.createTransporter = async () => {
  // const myOAuth2Client = new OAuth2(
  // {
  //   clientId: "743800966740-v90gbc6ltd3hm56ndh5ni32hc3l0uqp7.apps.googleusercontent.com",
  //   clientSecret: "xf9ijHAX_ZBupYsyCxiFiKNs",
  //   redirectUri: "https://developers.google.com/oauthplayground",
  //   forceRefreshOnFailure: true
  // }
  // );
  // try {
  //   const response = await myOAuth2Client.getToken({
  //     code: code,
  //     client_id: "743800966740-v90gbc6ltd3hm56ndh5ni32hc3l0uqp7.apps.googleusercontent.com",
  //     redirect_uri: "https://developers.google.com/oauthplayground",
  //     codeVerifier: 'authorization_code'
  //   });
  //   console.log('response', response);
  // } catch (error) {
  //   console.log('error', error);
  // }
  // myOAuth2Client.setCredentials({
  //   refresh_token: REFRESH_TOKEN
  // });
  // const accessToken = await new Promise((resolve, reject) => {
  //   myOAuth2Client.getAccessToken((err, token) => {
  //     if (err) {
  //       mailTransporterLogger.info('GetAccessTokenErr', err);
  //       reject("Failed to create access token :(");
  //     }
  //     resolve(token);
  //   });
  // }).catch((err) => {
  //   mailTransporterLogger.info('GetAccessTokenErr catch', err);
  // });
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     type: 'OAuth2',
  //     user: 'afreestylers2016@gmail.com',
  //     clientId: '743800966740-v90gbc6ltd3hm56ndh5ni32hc3l0uqp7.apps.googleusercontent.com',
  //     clientSecret: 'xf9ijHAX_ZBupYsyCxiFiKNs',
  //     refreshToken: REFRESH_TOKEN,
  //     accessToken
  //   }
  // });
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass
    }
  });
  return transporter;
}
