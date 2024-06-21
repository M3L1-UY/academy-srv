const express = require("express");
const router = express.Router();
const {
  AddContact,
  getContacts,
  delContact,
  updateContact
} = require("../../controller/mongodb/contact");

const { isAuthenticated, isAdmin } = require("../../middleware/auth");

router.post("/contact", AddContact);
router.get("/contacts", isAuthenticated, getContacts);
router.delete("/contact/:id",isAuthenticated, isAdmin(['isAdmin']), delContact);
router.put("/contact/:id",isAuthenticated, isAdmin(['isAdmin']), updateContact);

module.exports = router;
