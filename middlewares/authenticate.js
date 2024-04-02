const jwt = require("jsonwebtoken");

const { HttpError } = require("../helpers");
const { User } = require("../models/users/user");

const { SECRET_KEY } = process.env;

const authenticate = async (req, __, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ", 2);
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token || !user.verify) {
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = authenticate;
