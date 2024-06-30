require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");
const rateLimitMiddleware = require("./middlewares/rate-limit");
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const titleRoute = require("./routes/title-route");

const app = express();

app.use(cors());
app.use(morgan("short"));
app.use(rateLimitMiddleware);
app.use(express.json());
app.use(express.static("public")); //เาลาอยาก Rander รูปที่เราต้องการ  ตย http://localhost:7777/images/logo.png

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/title", titleRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || "7777";
app.listen(PORT, () => console.log(`Run ${PORT}`));
