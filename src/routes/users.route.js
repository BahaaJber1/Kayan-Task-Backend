import { getAllDoctors } from "#controllers/users.controller";
import { authenticationGuard } from "src/middlewares/authentication/authenticationGuard.middleware";
import { Router } from "express";

const usersRouter = Router();
usersRouter.use(authenticationGuard);

usersRouter.get("/", getAllDoctors);

export default usersRouter;
