import { environmentMode, JWTSettings, serverSettings } from "#config/settings";
import passportInstance from "#middlewares/passport/localStrategy";
import authenticationRouter from "#routes/authentication.routes";
import baseRouter from "#routes/base.routes";
import usersRouter from "#routes/users.route";
import visitsRouter from "#routes/visits.routes";
import cors from "cors";
import express from "express";
import session from "express-session";

const app = express();
const PORT = serverSettings.PORT;

app.use(
  cors({
    origin: [serverSettings.FRONTEND_URL_DEV, serverSettings.FRONTEND_URL_PROD],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" })); // adds size limit to the incoming JSON payloads

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

app.use(passportInstance.initialize());
app.use(passportInstance.session());
app.use(passportInstance.authenticate("session"));

app.use("/api/v1/authentication", authenticationRouter);
app.use("/", baseRouter);
app.use("/api/v1/visits", visitsRouter);
app.use("/api/v1/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
