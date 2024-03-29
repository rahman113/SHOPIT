const nodemailer = require('nodemailer');


const sendEmail = async options => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
              user: process.env.SMTP_EMAIL,
              pass: process.env.SMTP_PASSWORD
            }
          });

          const message = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message
          }
         const info =  await transporter.sendMail(message);
         console.log("message sent: %s", info.messageId);
        } catch(e) {
            console.log(e);

        }
}


module.exports = sendEmail