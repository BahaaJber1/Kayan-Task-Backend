import { environmentMode, JWTSettings, serverSettings } from "#config/settings";
import baseRouter from "#routes/base.routes";
import usersRouter from "#routes/users.routes";
import passportInstance from "#strategies/localStrategy";
import cors from "cors";
import express from "express";
import session from "express-session";
// import cookieSession from "cookie-session";

const app = express();
const PORT = serverSettings.PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: JWTSettings.SESSION_SECRET, // Used to sign session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false,
    cookie: {
      secure: environmentMode.MODE === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax",
    },
  })
);

// app.use(
//   cookieSession({
//     name: "cookie-session",
//     keys: [JWTSettings.SESSION_SECRET],
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//   })
// );

app.use(passportInstance.initialize());
app.use(passportInstance.session());
app.use(passportInstance.authenticate("session"));

app.use("/api/v1/users", usersRouter);
app.use("/", baseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
