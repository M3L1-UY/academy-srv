const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TeacherSchema = new mongoose.Schema(
  {
    dni: { type: String, required: true, unique: true },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    adress: { type: String, required: false, trim: true },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        `Ingrese un email válido`,
      ],
      required: true,
      trim: true,
      unique: true,
    },
    password: { type: String, required: true },
    city: { type: String, required: false },
    celular: { type: String, required: false },
    condicion: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

TeacherSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

TeacherSchema.methods.matchPassword = async function (password, oldPassword) {
  // return await bcrypt.compare(password, this.password);
  return await bcrypt.compare(password, oldPassword);
};

module.exports = mongoose.model("Teachers", TeacherSchema);
   