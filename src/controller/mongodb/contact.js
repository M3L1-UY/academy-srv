const Contacts = require("../../models/mongodb/contact");
const { enviarMail } = require("../../services/sendMail");

//**************************************************** */
//          Se crea registro en la BD                 //
//**************************************************** */

const AddContact = async (req, res) => {
  console.log(req.body);

  const contact = new Contacts({
    nombre: req.body.nombre,
    email: req.body.email,
    celular: req.body.celular,
    ciudad: req.body.ciudad,
    curso: req.body.curso,
    comentario: req.body.comentario,
  });
  try {
    const registro = await contact.save();

    await enviarMail({
      email: contact.email,
      subject: `¡Gracias por tu mensaje, ${contact.nombre}!`,
      message: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
              }
              h1 {
                color: #0056b3;
              }
              p {
                line-height: 1.6;
              }
              a {
                color: #0056b3;
                text-decoration: none;
              }
              .footer {
                margin-top: 20px;
                font-size: 0.8em;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>¡Hola ${contact.nombre}!</h1>
              <p>¡Gracias por ponerte en contacto con nosotros!</p>
              <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible. Aquí tienes una copia de los detalles que enviaste:</p>
              <ul>
                <li><strong>Email:</strong> ${contact.email}</li>
                <li><strong>Celular:</strong> ${contact.celular}</li>
                <li><strong>Ciudad:</strong> ${contact.ciudad}</li>
                <li><strong>Curso de interés:</strong> ${contact.curso}</li>
                <li><strong>Comentario:</strong> ${contact.comentario}</li>
              </ul>
              <p>Si tienes alguna pregunta adicional, no dudes en responder a este correo o contactarnos a través de <a href="mailto:soporte@academiait.com">soporte@academiait.com</a>.</p>
              <div class="footer">
                <p>Saludos cordiales,</p>
                <p>Equipo de Academia IT</p>
                <p><a href="http://www.academiait.com">www.academiait.com</a></p>
                <p>Síguenos en <a href="enlace-a-facebook">Facebook</a> | <a href="enlace-a-twitter">Twitter</a> | <a href="enlace-a-linkedin">LinkedIn</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    
    });


    // Send email to the company's email as a backup
    await enviarMail({
      email: 'testing.app.web@gmail.com',
      subject: `Nuevo mensaje de contacto de ${contact.nombre}`,
      message: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
              }
              h1 {
                color: #0056b3;
              }
              p {
                line-height: 1.6;
              }
              a {
                color: #0056b3;
                text-decoration: none;
              }
              .footer {
                margin-top: 20px;
                font-size: 0.8em;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Nuevo mensaje de contacto</h1>
              <p>Se ha recibido un nuevo mensaje de contacto. Aquí están los detalles:</p>
              <ul>
                <li><strong>Nombre:</strong> ${contact.nombre}</li>
                <li><strong>Email:</strong> ${contact.email}</li>
                <li><strong>Celular:</strong> ${contact.celular}</li>
                <li><strong>Ciudad:</strong> ${contact.ciudad}</li>
                <li><strong>Curso de interés:</strong> ${contact.curso}</li>
                <li><strong>Comentario:</strong> ${contact.comentario}</li>
              </ul>
              <p>Puedes responder directamente a este correo para ponerte en contacto con ${contact.nombre}.</p>
              <div class="footer">
                <p>Saludos cordiales,</p>
                <p>Equipo de Academia IT</p>
                <p><a href="http://www.academiait.com">www.academiait.com</a></p>
                <p>Síguenos en <a href="enlace-a-facebook">Facebook</a> | <a href="enlace-a-twitter">Twitter</a> | <a href="enlace-a-linkedin">LinkedIn</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    res.status(201).json({
      status: "201",
      data: registro,
      message: "El comentario fue enviado",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const data = await Contacts.find();
    console.log(data)
    res.status(200).json({ data: data, message: "Consulta exitosa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const delContact = async (req, res) => {
  try {
    console.log(`Attempting to delete contact with ID: ${req.params.id}`);
    const contact = await Contacts.findByIdAndDelete(req.params.id);
    if (contact) {
      console.log('Contact deleted successfully:', contact);
      res.status(200).json({ message: "Registro eliminado exitosamente" });
    } else {
      console.log('Contact not found for ID:', req.params.id);
      res.status(400).json({ message: "El ID indicado no está registrado" });
    }
  } catch (error) {
    console.error('Error occurred while deleting contact:', error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
    AddContact,
    getContacts,
    delContact
};
