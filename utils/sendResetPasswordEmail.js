import sendEmail from "./sendEmail.js";

const sendResetPasswordEmail = ({ name, email, origin, passwordToken }) => {
  const resetLink = `${origin}/user/reset-password?email=${email}&token=${passwordToken}`;
  const msg = `<h4>Hi ${name}</h4>
                 <p>Please click on the following link to reset your password <a href=${resetLink}>Reset Link</a></p>.`;

  return sendEmail({ to: email, subject: "Reset Password", html: msg });
};

export default sendResetPasswordEmail;
