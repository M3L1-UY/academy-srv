const Courses = require("../../models/mongodb/courses");

//**************************************************** */
//     Busca de datos generales de la base de datos    //
//**************************************************** */

const getCourses = async (req, res) => {
  try {
    const data = await Courses.find();
    res.status(200).json({ data: data, message: "Consulta exitosa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Busca de registro por id base de datos          //
//**************************************************** */

const getCourse = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);
    if (course) {
      res.status(200).json({ data: course, message: "Consulta exitosa" });
    } else {
      res.status(400).json({ message: "El ID indicado no está registrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//  Busca de registro por código en la base de datos   //
//**************************************************** */

const getCourseCodigo = async (req, res) => {
  try {
    const course = await Courses.findOne({ codigo: req.params.codigo });
    if (course) {
      res.status(200).json({ data: course, message: "Consulta exitosa" });
    } else {
      res.status(400).json({ message: "El código indicado no está registrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//     Eliminación de registro por id en la BD         //
//**************************************************** */

const delCourse = async (req, res) => {
  try {
    const course = await Courses.findByIdAndDelete(req.params.id);
    if (course) {
      res.status(200).json({ message: "Registro eliminado exitosamente" });
    } else {
      res.status(400).json({ message: "El ID indicado no está registrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//**************************************************** */
//          Se crea registro en la BD                 //
//**************************************************** */

const AddCourse = async (req, res) => {
  try {
    const existeItem = await Courses.findOne({ codigo: req.body.codigo });
    if (existeItem) {
      return res
        .status(400)
        .json({ message: "El código indicado ya está registrado" });
    }

    const course = new Courses({
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      costo: req.body.costo,
      condicion: req.body.condicion,
      duracion: req.body.duracion,
      clasificacion: req.body.clasificacion,
      profesores: req.body.profesores,
      urlImagen: req.body.urlImagen,
    });

    const registro = await course.save();
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
//        Actualización de registro en la BD          //
//**************************************************** */

const upDateCourse = async (req, res) => {
  try {
    const course = await Courses.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        costo: req.body.costo,
        condicion: req.body.condicion,
        duracion: req.body.duracion,
        clasificacion: req.body.clasificacion,
        profesores: req.body.profesores,
        urlImagen: req.body.urlImagen,
      },
      { new: true }
    );

    if (course) {
      res.json({
        data: course,
        message: "El registro fue actualizado",
      });
    } else {
      res.status(400).json({ message: "El ID indicado no está registrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourse,
  delCourse,
  AddCourse,
  upDateCourse,
  getCourseCodigo,
};
