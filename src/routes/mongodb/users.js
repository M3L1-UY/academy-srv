const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  delUser,
  AddUser,
  upDateUser,
  loginUser,
  logoutUser,
  cambioClaveUser,
  getUserDni,
} = require("../../controller/mongodb/users");
const { isAuthenticated, isAdmin } = require("../../middleware/auth");


/** ***************************************** */
/* Rutas de acceso a la tabla de cursos       */
/** **************************************** */

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.post("/user", AddUser);
router.post("/user/login", loginUser);
router.post("/user/logout", logoutUser);
router.delete("/user/:id", delUser);
router.put(
  "/user/cambio",
  isAuthenticated,
  isAdmin("isAdmin"),
  cambioClaveUser
);
router.put("/user/:id", upDateUser);

/** ***************************************** */
/* Rutas de acceso a la tabla de imagenes    */
/** **************************************** */

// router.post("/image", fileUpload, UserImg);

module.exports = router;
