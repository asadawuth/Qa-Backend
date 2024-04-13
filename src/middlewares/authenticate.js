const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");
const prisma = require("../Models/prisma");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization; //Bearer eyJhbGciOiJIUzI1NiIsInR5c
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("unanthenticated", 401));
    }
    // ไม่มี !authorization หรือ
    // Bearer tgtbtgrfefehrehefwdwd ex.1
    const token = authorization.split(" ")[1]; //tgtbtgrfefehrehefwdwd
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || "sd");

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      return next(createError("unanthenticated", 401));
    }
    delete user.password;
    req.user = user;
    // user = user: ""
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || "JsonWebTokenError") {
      error.statusCode = 401;
    }
    next(error);
  }
};
