import nodemailer from "nodemailer";

// إعداد إعدادات SMTP (هنا نستخدم Gmail كمثال)
const transporter = nodemailer.createTransport({
  service: "gmail",  // إذا كنت تستخدم Gmail
  auth: {
    user: process.env.EMAIL_USER,  // البريد الإلكتروني الذي سترسل منه
    pass: process.env.EMAIL_PASS,  // كلمة السر الخاصة بالبريد الإلكتروني
  },
});

// دالة لإرسال البريد الإلكتروني
export const sendVerificationEmail = async (to, token) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,  // من البريد الإلكتروني الذي سترسل منه
      to,  // إلى البريد الإلكتروني للمستقبل
      subject: "Please verify your email address",  // موضوع البريد الإلكتروني
      text: `Click the link to verify your email: http://localhost:5000/verify/${token}`,  // نص البريد الإلكتروني
    };

    // إرسال البريد الإلكتروني
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};
