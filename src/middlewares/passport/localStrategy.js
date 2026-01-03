import database from "#database/database";
import { signinSchema } from "#zod/authentication/signin.schema";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";

const passportInstance = passport;

passportInstance.use(
  new Strategy({ usernameField: "email" }, async function verify(
    email,
    password,
    cb
  ) {
    const parsedResult = signinSchema.safeParse({ email, password });
    if (!parsedResult.success) {
      const errorMessage = JSON.parse(parsedResult.error.message)[0].message;
      return cb(new Error(errorMessage));
    }
    database.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (err, result) => {
        if (err) {
          return cb(err);
        }
        if (!result.rows.length) {
          return cb(null, false, { message: "Incorrect email or password." });
        }

        bcrypt.compare(password, result.rows[0].password, (err, isMatch) => {
          if (err) {
            return cb(err);
          }
          if (!isMatch) {
            return cb(null, false, { message: "Incorrect email or password." });
          }
          return cb(null, result.rows[0]);
        });
      }
    );
  })
);

passportInstance.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passportInstance.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

export default passportInstance;
