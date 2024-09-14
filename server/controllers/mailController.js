const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "arlie32@ethereal.email",
    pass: "q3fGpkaRQySpZn8wpn",
  },
});

// async..await is not allowed in global scope, must use a wrapper

const sendEmail = async () => {
  try {
    // create test email account
    let testAccount = await nodemailer.createTestAccount();

    if (!testAccount) {
      console.log("Internal Server Error");
      return { message: "Internal Server Error" };
    }
    console.log("testAccount", testAccount);

    // create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // message object

    let message = {
      from: `Sender <${testAccount.user}>`,
      to: "Receiver <receipient@example.com>",
      subject: "Nodemailer is unicode friendly ✔",
      text: "Hello to myself!",
      html: "<p><b>Hello</b> to myself for the second time!</p>",
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(message);

    if (!info) {
      return { message: "Internal Server Error" };
    }

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return { message: "Email Sent", info };
  } catch (error) {
    console.log(error);
    return { message: "Internal Server Error" };
  }
};

module.exports = sendEmail;
