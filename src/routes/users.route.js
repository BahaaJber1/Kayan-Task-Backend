import { getAllDoctors } from "#controllers/users.controller";
import { authenticationGuard } from "#middleware/authentication/authenticationGuard.middleware";
import { Router } from "express";

const usersRouter = Router();
usersRouter.use(authenticationGuard);

usersRouter.get("/", getAllDoctors);

export default usersRouter;
