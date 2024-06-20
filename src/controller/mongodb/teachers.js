const Teachers = require("../../models/mongodb/teachers");

//**************************************************** */
//     Busca de datos generales de la base de datos    //
//**************************************************** */

const getTeachers = async (req, res) => {
  try {
    await Teachers.find().then((data) => {
      res.status(200).json({ data: data, message: "Consulta exitosa" });
      return;
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Busca de registro por id base de datos          //
//**************************************************** */

const getTeacher = async (req, res) => {
  try {
    const existeItem = await Teachers.findOne({ where: { id: req.params.id } });
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
//  Busca de registro por DNI en la  base de datos  //
//**************************************************** */

const getTeacherDni = async (req, res) => {
  try {
    const existeItem = await Teachers.findOne({
      where: { dni: req.params.dni },
    });
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

const delTeacher = async (req, res) => {
  const existeItem = await Teachers.findByIdAndDelete(req.params.id);
  if (!existeItem) {
    res.status(400).json({ message: "El ID indicado no está registrado" });
    return;
  }
  try {
    await Teachers.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Registro eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//**************************************************** */
//          Se crea registro en la BD                 //
//**************************************************** */

const AddTeacher = async (req, res) => {
  
  try {
    const { dni, email, password, ...rest } = req.body;

    const errors = await validateCamposUnique(dni, email);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }
    const teacher = new Teachers({
      dni,
      email,
      ...rest
    });

    teacher.password = await teacher.encryptPassword(password);

    const newTeacher = await teacher.save();

    res.status(201).json({
      status: "201",
      data: newTeacher,
      message: "El registro fue creado",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//**************************************************** */
//          Se actualiza registro en archivo json           //
//**************************************************** */

const upDateTeacher = async (req, res) => {
  const id = req.params.id;

  try {
    const teacher = await Teachers.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    const { dni, email, password, ...rest } = req.body;

    const errors = await validateCamposUnique(dni !== teacher.dni ? dni : null, email !== teacher.email ? email : null);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    if (dni) teacher.dni = dni;
    if (email) teacher.email = email;

    Object.assign(teacher, rest);

    if (password) {
      teacher.password = await teacher.encryptPassword(password);
    }

    const updatedTeacher = await teacher.save();
    res.json({ data: updatedTeacher, message: "El profesor fue actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const validateCamposUnique = async (dni, email) => {
  const errors = [];

  if (dni) {
    const dniExists = await Teachers.findOne({ dni });
    if (dniExists) {
      errors.push("El documento indicado ya está registrado");
    }
  }

  if (email) {
    const emailExists = await Teachers.findOne({ email });
    if (emailExists) {
      errors.push("El email indicado ya está registrado");
    }
  }

  return errors;
};

module.exports = {
  getTeachers,
  getTeacher,
  delTeacher,
  AddTeacher,
  upDateTeacher,
  getTeacherDni,
};
