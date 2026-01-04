import { Router } from "express";

const baseRouter = Router();

baseRouter.get("/success", (req, res, next) => {
  console.log("Successful login:", req.session.passport.user);
  const user = {
    role: req.session.passport.user.role,
    name: req.session.passport.user.name,
    email: req.session.passport.user.email,
  };
  res.send({ message: "Login successful, welcome in.", user });
});

baseRouter.get("/failure", (req, res, next) => {
  res.status(401).send({
    message: "signin failed, try again.",
    reason: "Invalid credentials.",
  });
});

export default baseRouter;
