import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Flipo",
      link: "https://flipo.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    secure:true,
    port:process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
                        
    },
  });

  const mail = {
    from: `${process.env.EMAIL}`,
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently. Make sure that you have provided your email credentials in the .env file",
    );
    console.error("Error: ", error);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welocome to our App! we are excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button.",
        button: {
          color: "#041470",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help or have questions? Just reply to this email, we'd love to help you",
    },
  };
};

const forgotPasswordMailgenContent = (username, otp) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions:
          "Please do not share your otp to anyone!",
        button: {
          color: "#22BC66",
          text: otp,
          link: "#",
        },
      },
      outro:
        "Need help or have questions? Just reply to this email, we'd love to help you",
    },
  };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail };
