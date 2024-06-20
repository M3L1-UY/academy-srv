const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 5000;
const app = express();+

app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
console.log(process.env.PORT);


require("./config/configMongoDB.js");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));
app.use("/imagens", express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(path.join(__dirname, "/public")));

/* ******************************************** */
/*   **** Sección de Rutas                      */
/* ******************************************** */
app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/html/welcome.html");
});

// /* ************ acceso a las rutas de BD MongoDB ***********/
app.use("/api/", require("./routes/mongodb/users.js"));
app.use("/api/", require("./routes/mongodb/course.js"));
app.use("/api/", require("./routes/mongodb/teacher.js"));
app.use("/api/", require("./routes/mongodb/Student.js"));
app.use("/api/", require("./routes/mongodb/Matricula.js"));
app.use("/api/", require("./routes/mongodb/contacts.js"));

app.use("*", (req, res) => {
  console.log("Request Type:", req.method);
  console.log("Request URL:", req.originalUrl);
});

app.use((red, res, next) => {
  res.status(404).sendFile(__dirname + "/public/html/404.html");
});

app.get("/imagens/:img", function (req, res) {
  res.sendFile(`imagens/${img}`);
});

app.use("*", (req, res) => {
  console.log("Request Type:", req.method);
  console.log("Request URL:", req.originalUrl);
});


// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ConnectionError) {
    return res.status(500).json({ message: "Error de conexión con la base de datos" });
  } else if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: "Error de validación", details: err.errors });
  } else if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Error de tipo de dato inválido", details: err.message });
  } else if (err.name === "MongoNetworkError" || err.message.includes("buffering timed out")) {
    return res.status(500).json({ message: "Error de red o de conexión con la base de datos" });
  }
  res.status(500).json({ message: "Error interno del servidor", details: err.message });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log("Servidor disponible en  http://localhost:" + port);
});