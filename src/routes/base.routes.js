import { Router } from "express";

const baseRouter = Router();

baseRouter.get("/success", (req, res, next) => {
  req.session.user = req.user;

  console.log(req.session);
  res.cookie("sessionData", JSON.stringify(req.session));
  res.send("Login successful!");
});

baseRouter.get("/failure", (req, res, next) => {
  res.send("Login failed. Please try again.");
});

export default baseRouter;
