const nodemailer = require("nodemailer");

exports.enviarMail = async (options) => {
  console.log("En envio de mail.....:", options);
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: options.email,
      subject: options.subject,
      text: "Envio de correos",
      attachDataUrls: true,
      html: `
        <h2>${options.message}</h2>
        `,
    };
    // Enviar correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log("Se ha enviado el correo electrónico correctamente.");
    console.log(info.response);
    return info.response;
  } catch (error) {
    console.log("Error al enviar el correo electrónico:", error);
    return error;
  }
};
