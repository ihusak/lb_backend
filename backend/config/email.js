const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const myOAuth2Client = new OAuth2(
  "743800966740-v90gbc6ltd3hm56ndh5ni32hc3l0uqp7.apps.googleusercontent.com",
  "xf9ijHAX_ZBupYsyCxiFiKNs",
  "https://developers.google.com/oauthplayground"
);
// myOAuth2Client.setCredentials({
//   refresh_token: '1//04-K4l5Z08NkfCgYIARAAGAQSNwF-L9IrPNaGVKJO33bPXuv4P2C5PWnRfh-a5uWSetukPrGylk4CA-GxfFhNRQDZ_dB1uOrv_c8'
// });
// const myAccessToken = myOAuth2Client.getAccessToken();

exports.transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'afreestylers2016@gmail.com',
    clientId: '743800966740-v90gbc6ltd3hm56ndh5ni32hc3l0uqp7.apps.googleusercontent.com',
    clientSecret: 'xf9ijHAX_ZBupYsyCxiFiKNs',
    refreshToken: '1//04-K4l5Z08NkfCgYIARAAGAQSNwF-L9IrPNaGVKJO33bPXuv4P2C5PWnRfh-a5uWSetukPrGylk4CA-GxfFhNRQDZ_dB1uOrv_c8',
    accessToken: (() => {
      myOAuth2Client.setCredentials({
        refresh_token: '1//04-K4l5Z08NkfCgYIARAAGAQSNwF-L9IrPNaGVKJO33bPXuv4P2C5PWnRfh-a5uWSetukPrGylk4CA-GxfFhNRQDZ_dB1uOrv_c8'
      });
      return myOAuth2Client.getAccessToken();
    })()
  }
});