const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");
const { ROLES } = require("../models");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name == "admin") {
          next();
          return;
        }
      }
      res.status(403).send({
        message:"Require Admin Role!!!!",
    });
    return;
    });
    
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name == "Moderator") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Moderator Role!!!!",
      });
      return;
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name == "ModeratororAdmin") {
          next();
          return;
        }
        if (roles[i].name == "Admin"){
            next();
            return;
        }
      }
      res.status(403).send({
        message: "Require Moderator or Admin Role!!!!",
      });
      return;
    });
  });
};

const authjwt = {
    verifyToken : verifyToken,
    isAdmin : isAdmin,
    isModerator : isModerator,
    isModeratorOrAdmin : isModeratorOrAdmin
}

module.exports = authjwt;
