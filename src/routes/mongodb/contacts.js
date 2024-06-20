const express = require("express");
const router = express.Router();
const {
  AddContact,
  getContacts,
  delContact
} = require("../../controller/mongodb/contact");

router.post("/contact", AddContact);
router.get("/contacts", getContacts);
router.delete("/contact/:id", delContact);

module.exports = router;
