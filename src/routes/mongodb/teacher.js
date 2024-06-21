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

const { isAuthenticated, isAdmin } = require("../../middleware/auth");

router.get("/teachers", getTeachers);
router.get("/teacher/:id", getTeacher);
router.get("/teacher/:dni", getTeacherDni);
router.post("/teacher", isAuthenticated, isAdmin(['isAdmin']), AddTeacher);
router.delete("/teacher/:id", isAuthenticated, isAdmin(['isAdmin']), delTeacher);
router.put("/teacher/:id", isAuthenticated, isAdmin(['isAdmin']), upDateTeacher);

module.exports = router;
