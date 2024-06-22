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
  return roleDescriptions[role] || role; 
};

exports.isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwtAcademy || req.body.token || req.headers['authorization'];
  if (!token) {
    return res.status(401).json({
      status: "401",
      message: "Debe loguearse para utilizar esta función.",
    });
  }
  try {
    const user = verifyToken(token);
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
      if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "403",
        message: `Como ${getRoleDescription(req.user.role)}, no puedes acceder a este recurso!`,
      });
    }
    next();
  };
};
