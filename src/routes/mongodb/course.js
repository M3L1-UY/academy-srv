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


/** ***************************************** */
/* Rutas de acceso a la tabla de cursos       */
/** **************************************** */

router.get("/courses", getCourses);
router.get("/course/:id", getCourse);
router.get("/course/:codigo", getCourseCodigo);
router.post("/course", AddCourse);
router.put("/course/:id", upDateCourse);
router.delete("/course/:id", delCourse);

/** ***************************************** */
/* Rutas de acceso a la tabla de imagenes    */
/** **************************************** */

module.exports = router;
