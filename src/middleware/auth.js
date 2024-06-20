const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new Error("Token inválido");
  }
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
    req.user = user.id;
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
      if (user.role !== roles) {
        return res.status(401).json({
          status: "401",
          message: `Como ${user.role}, no puedes acceder a este recurso!`,
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
