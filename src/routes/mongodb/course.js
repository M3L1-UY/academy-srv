const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourse,
  delCourse,
  AddCourse,
  upDateCourse,
  getCourseCodigo,
} = require("../../controller/mongodb/courses");

const { isAuthenticated, isAdmin } = require("../../middleware/auth");

router.get("/courses", getCourses);
router.get("/course/:id", getCourse);
router.get("/course/:codigo", getCourseCodigo);
router.post("/course",  isAuthenticated, isAdmin(['isAdmin']), AddCourse);
router.put("/course/:id",  isAuthenticated, isAdmin(['isAdmin']), upDateCourse);
router.delete("/course/:id",  isAuthenticated, isAdmin(['isAdmin']), delCourse);

module.exports = router;
