import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/routeindex.js";
import cors from "cors";
import dotenv from "dotenv";
import {
  contentMiddleware,
  rateLimitMiddleware,
} from "api-security-middleware";
import Ddos from "ddos";
var ddos = new Ddos({ burst: 30, limit: 25 });
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// SQL Detection
app.use(contentMiddleware.sqlDetectionMiddleware());

// XSS Detection
//app.use(contentMiddleware.xssDetectionMiddleware());

// Rate limit for every IP, maximum of 20 requests in 1 sec
app.use(rateLimitMiddleware(1000, 20));

app.use(ddos.express); //handle dos attacks by slowing requests
app.use(
  session({
    name: "AuthState",
    secret: "secret session",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 },
  })
);

configRoutes(app);

app.listen(3000, () => {
  console.log("Server is running!!");
  console.log("Your routes will be running on http://localhost:3000");
});
