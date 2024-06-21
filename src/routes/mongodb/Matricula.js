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
const { isAuthenticated, isAdmin } = require("../../middleware/auth");

router.get("/matriculas", isAuthenticated, isAdmin(['isAdmin', 'isTeacher']), getMatriculas);
router.get("/matricula/:id", isAuthenticated, isAdmin(['isAdmin', 'isTeacher']), getMatricula);
router.get("/matricula/:dni", isAuthenticated, getMatriculaDni);
router.post("/matricula", isAuthenticated, isAdmin(['isAdmin']), validarData, AddMatricula);
router.put("/matricula/:id", isAuthenticated, isAdmin(['isAdmin']), validarData, updateMatricula);
router.delete("/matricula/:id", isAuthenticated, isAdmin(['isAdmin']), delMatricula);

function validarData(req, res, next) {
  next();
}

module.exports = router;
