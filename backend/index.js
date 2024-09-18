import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import dbConnection from "./dbConfig/dbConnection.js";
import router from "./routes/index.js";
import errorMiddleWare from "./middlewares/errorMiddleware.js";
import cookieSession from "cookie-session";
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
dbConnection();
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, 
    keys: [process.env.JWT_SECRET_KEY],
  })
);
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(morgan("dev"));
app.use(router);
app.use(errorMiddleWare);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

if (!process.env.JWT_SECRET_KEY || !process.env.JWT_EXPIRE) {
  throw new Error(
    "Please set JWT_SECRET_KEY and JWT_EXPIRE environment variables"
  );
}

