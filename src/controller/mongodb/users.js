const bcrypt = require("bcryptjs");
const { generarJWT, verifyJWT } = require("../../services/general");
const { enviarMail } = require("../../services/sendMail");
const Users = require("../../models/mongodb/users");

//**************************************************** */
//     Busca de datos generales de la base de datos    //
//**************************************************** */

const getUsers = async (req, res) => {
  try {
    await Users.find().then((data) => {
      res.status(200).json({ data: data, message: "Consulta exitosa" });
      return;
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Busca de registro por id base de datos          //Compass
//**************************************************** */

const getUser = async (req, res) => {
  try {
    const existeItem = await Users.findOne({ id: req.params.id });
    if (existeItem) {
      res.status(200).json({ data: existeItem, message: "Consulta exitosa" });
      return;
    }
    if (!existeItem) {
      res.status(400).json({ message: "El ID indicado no está registrado" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//**************************************************** */
//  Busca de registro por código en la  base de datos  //
//**************************************************** */

const getUserDni = async (req, res) => {
  try {
    const existeItem = await Users.findOne({ dni: req.params.dni });
    if (existeItem) {
      res.status(200).json({ data: existeItem, message: "Consulta exitosa" });
      return;
    }
    if (!existeItem) {
      res.status(400).json({ message: "El ID indicado no está registrado" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Eliminación de registro por id en la BD          //
//**************************************************** */

const delUser = async (req, res) => {
  const existeItem = await Users.findByIdAndDelete(req.params.id);
  if (!existeItem) {
    res.status(400).json({ message: "El ID indicado no está registrado" });
    return;
  }
  try {
    // await Users.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Registro eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//          Se crea registro en la BD                 //
//**************************************************** */

const AddUser = async (req, res) => {
   
  try {
    const { dni, email, password, ...rest } = req.body;

    const errors = await validateCamposUnique(dni, email);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }
    const user = new Users({
      dni,
      email,
      ...rest
    });

    user.password = await user.encryptPassword(password);
    const registro = await user.save();
    await enviarMail({
      email: user.email,
      subject: `¡Bienvenid@ ${user.nombre} a Academia IT! 🎓`,
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
              <h1>¡Hola ${user.nombre}!</h1>
              <p>¡Nos alegra darte la bienvenida a <strong>Academia IT</strong>!</p>
              <p>Nos complace informarte que tu registro ha sido exitoso. Ahora formas parte de una comunidad dedicada al aprendizaje y la innovación en el campo de la tecnología.</p> 
              <p>Estamos aquí para acompañarte en cada paso de tu camino de aprendizaje. Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos a través de <a href="mailto:soporte@academiait.com">soporte@academiait.com</a>.</p>
              <p>Una vez más, bienvenido a <strong>Academia IT</strong>. ¡Esperamos que disfrutes de tu experiencia de aprendizaje con nosotros!</p>
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
      message: "El registro fue creado",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//          Se actualiza registro en archivo json           //
//**************************************************** */
const upDateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { dni, email, password, ...rest } = req.body;

    const errors = await validateCamposUnique(dni !== user.dni ? dni : null, email !== user.email ? email : null);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    if (dni) user.dni = dni;
    if (email) user.email = email;

    Object.assign(user, rest);

    if (password) {
      user.password = await user.encryptPassword(password);
    }

    const updatedUser = await user.save();
    res.json({ data: updatedUser, message: "El usuario fue actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//**************************************************** */
//       Sección de acceso por el Login de usuario    //
//**************************************************** */

const loginUser = async (req, res, next) => {
  console.log("Datos de entrada....:", req.body);
  const { email, password } = req.body;
  const usuario = await Users.findOne({ email });

  if (!usuario) {
    return res.status(400).json({
      status: "400",
      message: "El email indicado no está registrado",
    });
  }

  const match = await usuario.matchPassword(password, usuario.password);

  if (!match) {
    return res.status(400).json({
      status: "400",
      message: "La contraseña es incorrecta.",
    });
  }

  const token = generarJWT(usuario);
  const regNew = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    role: usuario.role,
    email: usuario.email,
    condicion: usuario.condicion,
    celular: usuario.celular,
    token: token,
    login: true,
  };

  res.cookie("jwtAcademy", token);
  res.status(200).json({
    status: "200",
    data: regNew,
  });
};

const logoutUser = async (req, res) => {
  res.clearCookie("jwtAcademy"); 
  res.status(200).json({
    status: "200",
    message: "Logout exitoso",
  });
};

const cambioClaveUser = async (req, res) => {
  // console.log("Entre. body...:", req.body);
  // console.log("Datos del token.....:", verifyJWT(req.body.token));
  let user = new Users();
  let encriClave = await user.encryptPassword(req.body.newPassword, 10);
  console.log("Encrita....:", encriClave);
  const usuario = await Users.findOne({ email: req.body.email });
  // console.log("usuario..........:", usuario);
  if (!usuario) {
    return res
      .status(400)
      .json({ status: "400", message: "El usuario no está registrado" });
  } else {
    console.log("pase a verificación.....:", req.body.oldPassword);
    const comp = await usuario.matchPassword(
      req.body.oldPassword,
      usuario.password
    );
    if (!comp) {
      return res
        .status(400)
        .json({ status: "400", message: "Contraseña actual incorrecta" });
    }
    try {
      let encriClave = await user.encryptPassword(req.body.newPassword, 10);
      const item_data = await Users.findByIdAndUpdate(usuario._id, {
        password: encriClave,
      });
      res.status(200).json({
        status: "200",
        message: "Contraseña actualizada correctamente",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};


const validateCamposUnique = async (dni, email) => {
  const errors = [];

  if (dni) {
    const dniExists = await Users.findOne({ dni });
    if (dniExists) {
      errors.push("El documento indicado ya está registrado");
    }
  }

  if (email) {
    const emailExists = await Users.findOne({ email });
    if (emailExists) {
      errors.push("El email indicado ya está registrado");
    }
  }

  return errors;
};

module.exports = {
  getUsers,
  getUser,
  delUser,
  AddUser,
  upDateUser,
  loginUser,
  logoutUser,
  cambioClaveUser,
  getUserDni
};
