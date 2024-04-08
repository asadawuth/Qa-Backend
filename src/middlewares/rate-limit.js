const { rateLimit } = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 60 * 60 * 1000, // 1H
  limit: 100, // ยิงได้100 ครั้ง
  message: "Too many requests from this IP", //1 * 60 * 1000, limit: 1 // ขึ้น Too many requests from this IP เช็คผ่านโอเคร
});
