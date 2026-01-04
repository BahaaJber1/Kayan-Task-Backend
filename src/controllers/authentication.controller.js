import { JWTSettings } from "#config/settings";
import database from "#database/database";
import { signupSchema } from "#zod/authentication/signup.schema";
import bcrypt from "bcrypt";

const signup = async (req, res, next) => {
  const parsedResult = signupSchema.safeParse(req.body);
  if (!parsedResult.success) {
    const errorMessage = await JSON.parse(parsedResult.error.message)[0]
      .message;
    return next(new Error(errorMessage));
  }

  const { email, name, password, role } = req.body;

  const query = `INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4) RETURNING *`;
  bcrypt.hash(
    password,
    JWTSettings.SALT_ROUNDS,
    async (error, hashedPassword) => {
      if (error) {
        return next(new Error("Error hashing password"));
      }
      const values = [email, name, hashedPassword, role];
      database.query(query, values, (err, result) => {
        if (err) {
          return next(new Error(err.message));
        }

        if (!result.rows) {
          return next(new Error("Failed to add user"));
        }

        const user = result.rows[0];

        req.login(user, (err) => {
          if (err) {
            return next(
              new Error("Error signing in the user after registration" + err)
            );
          }
          delete result.rows[0].password; // Remove password from the response
          res
            .status(201)
            .send({ message: "User registered successfully", user });
        });
      });
    }
  );
};

const signoutUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new Error("User is not authenticated"));
  }
  req.logout((err) => {
    if (err) {
      return next(new Error("Error logging out the user: " + err));
    }

    res.clearCookie("sessionData");
    res.send({ message: "User signed out successfully" });
  });
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log({ isAuthenticated: true });
    const user = {
      role: req.session.passport.user.role,
      name: req.session.passport.user.name,
    };
    return res.send({ message: "User is authenticated", user });
  }
  console.log({ isAuthenticated: false });
  return next(new Error("User is not authenticated"));
};

export { signup, signoutUser, isAuthenticated };
