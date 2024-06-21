const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudent,
  getStudentDni,
  AddStudent,
  delStudent,
  updateStudent,
} = require("../../controller/mongodb/students");
const { isAuthenticated, isAdmin } = require("../../middleware/auth");

router.get("/students", getStudents);
router.get("/student/:id", getStudent);
router.get("/studentdni/:dni", getStudentDni);
router.post("/student", isAuthenticated,isAdmin(['isAdmin', 'isStudent']), validarData, AddStudent);
router.put("/student/:id", isAuthenticated, isAdmin(['isAdmin', 'isStudent']), validarData, updateStudent);
router.delete("/student/:id", isAuthenticated, isAdmin(['isAdmin']), delStudent);

function validarData(req, res, next) {
  const { dni, nombre, descripcion } = req.body;
  next();
}

module.exports = router;
