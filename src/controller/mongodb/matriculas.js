const Matriculas = require("../../models/mongodb/matricula");

//**************************************************** */
//     Busca de datos generales de la base de datos    //
//**************************************************** */

const getMatriculas = async (req, res) => {
  try {
    const data = await Matriculas.find();
    res.status(200).json({ data: data, message: "Consulta exitosa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Busca de registro por id base de datos          //
//**************************************************** */

const getMatricula = async (req, res) => {
  try {
    const existeItem = await Matriculas.findById(req.params.id);
    if (existeItem) {
      res.status(200).json({ data: existeItem, message: "Consulta exitosa" });
    } else {
      res.status(400).json({ message: "El ID indicado no está registrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//  Busca de registro por DNI en la  base de datos      //
//**************************************************** */

const getMatriculaDni = async (req, res) => {
  try {
    const existeItem = await Matriculas.findOne({ dni: req.params.dni });
    if (existeItem) {
      res.status(200).json({ data: existeItem, message: "Consulta exitosa" });
    } else {
      res.status(400).json({ message: "El DNI indicado no está registrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Eliminación de registro por id en la BD         //
//**************************************************** */

const delMatricula = async (req, res) => {
  try {
    const existeItem = await Matriculas.findByIdAndDelete(req.params.id);
    if (existeItem) {
      res.status(200).json({ message: "Registro eliminado exitosamente" });
    } else {
      res.status(400).json({ message: "El ID indicado no está registrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//          Se crea registro en la BD                  //
//**************************************************** */

const AddMatricula = async (req, res) => {
  try {
    const existeItem = await Matriculas.findOne({
      cursoId: req.body.cursoId,
      studentId: req.body.studentId,
    });

    if (existeItem) {
      return res
        .status(400)
        .json({ message: "El estudiante ya está registrado" });
    }

    const matricula = new Matriculas({
      cursoId: req.body.cursoId,
      cursoNombre: req.body.cursoNombre,
      teacherId: req.body.teacherId,
      teacherNombre: req.body.teacherNombre,
      studentId: req.body.studentId,
      studentNombre: req.body.studentNombre,
      turno: req.body.turno,
      finicio: req.body.finicio,
      ffin: req.body.ffin,
    });

    const registro = await matricula.save();
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
//          Se actualiza registro en la BD             //
//**************************************************** */

const updateMatricula = async (req, res) => {
  const id = req.params.id;
  try {
    const existeItem = await Matriculas.findById(id);
    if (!existeItem) {
      return res.status(400).json({ message: "El ID indicado no está registrado" });
    }

    if (existeItem.studentId !== req.body.studentId) {
      const duplicateItem = await Matriculas.findOne({
        cursoId: req.body.cursoId,
        studentId: req.body.studentId,
      });
      if (duplicateItem) {
        return res.status(400).json({ message: "El estudiante ya está registrado" });
      }
    }

    const updatedMatricula = await Matriculas.findByIdAndUpdate(id, {
      cursoId: req.body.cursoId,
      cursoNombre: req.body.cursoNombre,
      teacherId: req.body.teacherId,
      teacherNombre: req.body.teacherNombre,
      studentId: req.body.studentId,
      studentNombre: req.body.studentNombre,
      turno: req.body.turno,
      finicio: req.body.finicio,
      ffin: req.body.ffin,
    }, { new: true });

    res.json({
      data: updatedMatricula,
      message: "El registro fue actualizado",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMatriculas,
  getMatricula,
  delMatricula,
  AddMatricula,
  updateMatricula,
  getMatriculaDni,
};
