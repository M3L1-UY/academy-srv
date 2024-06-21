const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Mixed } = Schema.Types;

const ContactsSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        `Ingrese un email válido`,
      ],
      required: true,
      trim: true,
    },
    celular: { type: String, required: false },
    ciudad: { type: String},
    curso: { type: String, required: true},
    comentario: { type: String, required: true },
    done: { type: Boolean , required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contacts", ContactsSchema);
