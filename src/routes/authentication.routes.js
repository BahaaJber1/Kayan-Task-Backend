import * as usersController from "#controllers/authentication.controller";
import passportInstance from "src/middlewares/passport/localStrategy";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post(
  "/signin",
  passportInstance.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
);
authenticationRouter.post("/signup", usersController.signup);
authenticationRouter.post("/signout", usersController.signoutUser);
authenticationRouter.get("/verify", usersController.isAuthenticated);

export default authenticationRouter;
