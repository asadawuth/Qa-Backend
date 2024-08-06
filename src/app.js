require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFoundMiddleware = require("./middlewares/not-found"); // หน้าบ้านพัง
const errorMiddleware = require("./middlewares/error"); // ValidationError ไม่ผ่าน
const rateLimitMiddleware = require("./middlewares/rate-limit"); // เวลา login และ ยิงได้กี่ครั้ง
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const titleRoute = require("./routes/title-route");
const commentRoute = require("./routes/comment-route");

const app = express(); // ทำ path

app.use(cors()); // ไว้หน้าบ้าน
app.use(morgan("short")); // ดูการทำงาน req,res
app.use(rateLimitMiddleware); // เวลา ในการ Login
app.use(express.json()); //path ต่างๆ
app.use(express.static("public")); //เาลาอยาก Rander รูปที่เราต้องการ  ตย http://localhost:7777/images/logo.png

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/title", titleRoute);
app.use("/comment", commentRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || "7777";
app.listen(PORT, () => console.log(`Run ${PORT}`));
