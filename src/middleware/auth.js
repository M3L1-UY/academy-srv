const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new Error("Token inválido");
  }
};

const roleDescriptions = {
  isAdmin: 'administrativo',
  isTeacher: 'profesor',
  isStudent: 'estudiante',
};

const getRoleDescription = (role) => {
  return roleDescriptions[role] || role; // Devuelve la descripción del rol o el rol tal cual si no hay descripción
};

exports.isAuthenticated = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({
      status: "401",
      message: "Debe loguearse para utilizar esta función.",
    });
  }
  try {
    const user = verifyToken(token);
    req.user = user; // Guarda toda la información del usuario, no solo el id
    next();
  } catch (error) {
    res.status(401).json({
      status: "401",
      message: "Token inválido.",
    });
  }
};

exports.isSeller = (req, res, next) => {
  const bodyToken = req.cookies.body_token;
  if (!bodyToken) {
    return res.status(401).json({
      status: "401",
      message: "Debe loguearse para utilizar este recurso.",
    });
  }
  try {
    const user = verifyToken(bodyToken);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "401",
      message: "Token inválido.",
    });
  }
};

exports.isAdmin = (roles) => {
  return (req, res, next) => {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({
        status: "401",
        message: "Debe loguearse para utilizar este recurso.",
      });
    }
    try {
      const user = verifyToken(token);
      console.log(user.role)
      if (!roles.includes(user.role)) {
        return res.status(401).json({
          status: "401",
          message: `Como ${getRoleDescription(user.role)}, no puedes acceder a este recurso!`,
        });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        status: "401",
        message: "Token inválido.",
      });
    }
  };
};
