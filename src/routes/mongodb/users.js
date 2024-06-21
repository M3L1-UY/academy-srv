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

router.get("/users",isAuthenticated, isAdmin(['isAdmin']), getUsers);
router.get("/user/:id", isAuthenticated,  isAdmin(['isAdmin']), getUser);
router.post("/user", isAuthenticated, isAdmin(['isAdmin']), AddUser);
router.post("/user/login", loginUser);
router.post("/user/logout", logoutUser);
router.delete("/user/:id",  isAuthenticated, isAdmin(['isAdmin']),delUser);
router.put(
  "/user/cambio",
  isAuthenticated,
  cambioClaveUser
);
router.put("/user/:id", upDateUser);


module.exports = router;
