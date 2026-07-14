import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSCODE,
      },
    });

    const mailOption = {
      from: process.env.GMAIL_USERNAME,
      to,
      subject,
      html: message,
    };

    const res = await transporter.sendMail(mailOption);
    return res;
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw error;
  }
};

export default sendEmail;
