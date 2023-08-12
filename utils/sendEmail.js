import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  //  create tranporter(ethereal config) using nodemailer
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: process.env.ETHERIAL_PORT,
  //   auth: {
  //     user: process.env.ETHERIAL_USER,
  //     pass: process.env.ETHERIAL_PASS,
  //   },
  // });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  //   send email using previously created transporter
  return transporter.sendMail({
    from: '"Intensify" <intensify@intensify.com>',
    to,
    subject,
    html,
  });
};

export default sendEmail;
