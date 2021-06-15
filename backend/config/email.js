const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const config = require("../../config.json");
const {mailTransporterLogger} = require('../config/middleware/logger');
const OAuth2 = google.auth.OAuth2;

exports.createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user: config.mail.user,
      pass: config.mail.pass
    }
  });
  return transporter;
}
