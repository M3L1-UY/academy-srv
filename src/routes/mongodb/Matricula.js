const express = require("express");
const router = express.Router();
const {
  getMatriculas,
  getMatricula,
  getMatriculaDni,
  AddMatricula,
  delMatricula,
  updateMatricula,
} = require("../../controller/mongodb/matriculas");

/* *******************************************************  */
/*             Ruta de acceso a archivos Matriculas           */
/* *******************************************************  */

router.get("/matriculas", getMatriculas);
router.get("/matricula/:id", getMatricula);
router.get("/matricula/:dni", getMatriculaDni);
router.post("/matricula", validarData, AddMatricula);
router.put("/matricula/:id", validarData, updateMatricula);
router.delete("/matricula/:id", delMatricula);
function validarData(req, res, next) {
  // console.log("Body....", req.body);
  const { dni, nombre, descripcion } = req.body;

  // if (!dni) {
  //   return res.status(400).json({
  //     message: "Ingrese un dni válido..",
  //     exito: false,
  //   });
  // }
  // if (!nombre) {
  //   return res.status(400).json({
  //     message: "El nombre, del Estudiante está vacío..",
  //     exito: false,
  //   });
  // }
  next();
}

module.exports = router;
