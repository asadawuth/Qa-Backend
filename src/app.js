require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");
const rateLimitMiddleware = require("./middlewares/rate-limit");

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(rateLimitMiddleware);
app.use(express.json());

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || "7777";
app.listen(PORT, () => console.log(`Run ${PORT}`));
