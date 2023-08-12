import sendEmail from "./sendEmail.js";

const sendVerificationEmail = async ({
  name,
  email,
  origin,
  verificationToken,
}) => {
  const verifyLink = `${origin}/user/verify-email?email=${email}&token=${verificationToken}`;

  const message = `<h4>Hello ${name}</h4>
                <p>Please confirm your email by clicking on the following link :
                <a href=${verifyLink}>Verify Email</a>`;

  return sendEmail({ to: email, subject: "Verify Email", html: message });
};

export default sendVerificationEmail;
