import * as authenticationController from "#controllers/authentication.controller";
import database from "#database/database";
import passportInstance from "#middlewares/passport/localStrategy";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post(
  "/signin",
  passportInstance.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
);
authenticationRouter.post("/signup", authenticationController.signup);
authenticationRouter.post("/signout", authenticationController.signoutUser);
authenticationRouter.get("/verify", authenticationController.isAuthenticated);

export default authenticationRouter;
