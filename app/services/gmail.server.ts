import { createTransport } from "nodemailer";

const gmail = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_SECRET,
  },
});
export default gmail;
