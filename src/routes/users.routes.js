import * as usersController from "#controllers/users.controller";
import passportInstance from "#strategies/localStrategy";
import { Router } from "express";

const usersRouter = Router();

usersRouter.post(
  "/login",
  passportInstance.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
);
usersRouter.post("/signup", usersController.addUser);

export default usersRouter;
