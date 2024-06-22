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
  let token = req.cookies.jwtAcademy || req.body.token;

  // Verifica si hay un encabezado de autorización y extrae el token si está presente
  if (req.headers['authorization']) {
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader.startsWith('Bearer ')) {
      token = authorizationHeader.split(' ')[1];
    } else {
      return res.status(401).json({
        status: "401",
        message: "Formato de token inválido. Debe ser 'Bearer <token>'."
      });
    }
  }

  // Si no se proporcionó ningún token
  if (!token) {
    return res.status(401).json({
      status: "401",
      message: "Debe estar autenticado para acceder a esta función."
    });
  }

  try {
    const user = verifyToken(token); // Verifica y decodifica el token

    // Asigna el usuario al objeto de solicitud (req) para que esté disponible en las rutas protegidas
    req.user = user;

    // Llama a la siguiente función en la cadena de middleware
    next();
  } catch (error) {
    return res.status(401).json({
      status: "401",
      message: "Token inválido o expirado."
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
