const Students = require("../../models/mongodb/students");

//**************************************************** */
//     Busca de datos generales de la base de datos    //
//**************************************************** */

const getStudents = async (req, res) => {
  try {
    const students = await Students.find();
    res.status(200).json({ data: students, message: "Consulta exitosa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Busca de registro por id base de datos          //
//**************************************************** */

const getStudent = async (req, res) => {
  try {
    const student = await Students.findById(req.params.id);
    if (student) {
      res.status(200).json({ data: student, message: "Consulta exitosa" });
    } else {
      res.status(404).json({ message: "El ID indicado no está registrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//  Busca de registro por DNI en la  base de datos     //
//**************************************************** */

const getStudentDni = async (req, res) => {
  try {
    const student = await Students.findOne({ dni: req.params.dni });
    if (student) {
      res.status(200).json({ data: student, message: "Consulta exitosa" });
    } else {
      res.status(404).json({ message: "El DNI indicado no está registrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Eliminación de registro por id en la BD         //
//**************************************************** */

const delStudent = async (req, res) => {
  try {
    const student = await Students.findByIdAndDelete(req.params.id);
    if (student) {
      res.status(200).json({ message: "Registro eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "El ID indicado no está registrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//          Se crea registro en la BD                 //
//**************************************************** */

const AddStudent = async (req, res) => {

  try {
    const { dni, email, password, ...rest } = req.body;

    const errors = await validateCamposUnique(dni, email);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }
    const student = new Students({
      dni,
      email,
      ...rest
    });

    student.password = await student.encryptPassword(password);

    const newStudent = await student.save();

    res.status(201).json({
      status: "201",
      data: newStudent,
      message: "El registro fue creado",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//          Se actualiza registro en la BD            //
//**************************************************** */

const updateStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Students.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const { dni, email, password, ...rest } = req.body;

    const errors = await validateCamposUnique(dni !== student.dni ? dni : null, email !== student.email ? email : null);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    if (dni) student.dni = dni;
    if (email) student.email = email;

    Object.assign(student, rest);

    if (password) {
      student.password = await student.encryptPassword(password);
    }

    const updatedStudent = await student.save();
    res.json({ data: updatedStudent, message: "El estudiante fue actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateCamposUnique = async (dni, email) => {
  const errors = [];

  if (dni) {
    const dniExists = await Students.findOne({ dni });
    if (dniExists) {
      errors.push("El documento indicado ya está registrado");
    }
  }

  if (email) {
    const emailExists = await Students.findOne({ email });
    if (emailExists) {
      errors.push("El email indicado ya está registrado");
    }
  }

  return errors;
};

module.exports = {
  getStudents,
  getStudent,
  getStudentDni,
  delStudent,
  AddStudent,
  updateStudent,
};
