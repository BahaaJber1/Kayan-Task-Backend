import {
  acceptVisit,
  bookVisit,
  cancelVisit,
  completeVisit,
  getAllVisits,
} from "#controllers/visits.controller";
import { authenticationGuard } from "#middlewares/authentication/authenticationGuard.middleware";
import { Router } from "express";

const visitsRouter = Router();

visitsRouter.use(authenticationGuard);

visitsRouter.post("/book", bookVisit);
visitsRouter.post("/complete", completeVisit);
visitsRouter.post("/accept", acceptVisit);
visitsRouter.post("/cancel", cancelVisit);
visitsRouter.get("/", getAllVisits);

export default visitsRouter;
