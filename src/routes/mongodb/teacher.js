const express = require("express");
const router = express.Router();
const {
  getTeachers,
  getTeacher,
  delTeacher,
  AddTeacher,
  upDateTeacher,
  getTeacherDni,
} = require("../../controller/mongodb/teachers");

/** ***************************************** */
/* Rutas de acceso a la tabla de Profesores  */
/** **************************************** */

router.get("/teachers", getTeachers);
router.get("/teacher/:id", getTeacher);
router.get("/teacher/:dni", getTeacherDni);
router.post("/teacher", AddTeacher);
router.delete("/teacher/:id", delTeacher);
router.put("/teacher/:id",  upDateTeacher);

module.exports = router;
