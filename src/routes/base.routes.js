import { Router } from "express";

const baseRouter = Router();

baseRouter.get("/success", (req, res, next) => {
  const user = {
    role: req.session.passport.user.role,
    name: req.session.passport.user.name,
  };
  res.send({ message: "Login successful", user });
});

baseRouter.get("/failure", (req, res, next) => {
  res.status(400).send("Login failed. Please try again.");
});

export default baseRouter;
