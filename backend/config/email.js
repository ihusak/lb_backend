const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const myOAuth2Client = new OAuth2(
  "743800966740-v90gbc6ltd3hm56ndh5ni32hc3l0uqp7.apps.googleusercontent.com",
  "xf9ijHAX_ZBupYsyCxiFiKNs",
  "https://developers.google.com/oauthplayground"
);
myOAuth2Client.setCredentials({
  refresh_token: '1//04WpydTp6lIH1CgYIARAAGAQSNwF-L9IrHr8gbQDsa1Cg5gtt8eMIvBARRLq-pwMEdJrGxE3OJFiEjMDNcYbl357otnkx1f2Z-PU'
});
const myAccessToken = myOAuth2Client.getAccessToken()

exports.transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'afreestylers2016@gmail.com',
    clientId: '743800966740-v90gbc6ltd3hm56ndh5ni32hc3l0uqp7.apps.googleusercontent.com',
    clientSecret: 'xf9ijHAX_ZBupYsyCxiFiKNs',
    refreshToken: '1//04WpydTp6lIH1CgYIARAAGAQSNwF-L9IrHr8gbQDsa1Cg5gtt8eMIvBARRLq-pwMEdJrGxE3OJFiEjMDNcYbl357otnkx1f2Z-PU',
    accessToken: myAccessToken
  }
});