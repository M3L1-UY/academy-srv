const mongoose = require("mongoose");

const MatriculasSchema = new mongoose.Schema(
  {
    cursoId: { type: String, required: true, trim: true},
    cursoNombre: { type: String, required: true , trim: true},
    teacherId: { type: String, required: true, trim: true },
    teacherNombre: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true },
    studentNombre: { type: String, required: true, trim: true },
    turno: { type: String, required: true },
    finicio: { type: Date, required: true },
    ffin: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Matriculas", MatriculasSchema);
