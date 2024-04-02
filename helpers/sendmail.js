const nodemailer = require("nodemailer");

const sendEmail = async(data) => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
  const email= {...data, from:"victoria75076@gmail.com"};
  transport.sendMail(email);
  return true;
};

module.exports = sendEmail;
