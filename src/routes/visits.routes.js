import {
  acceptVisit,
  bookVisit,
  completeVisit,
  getAllVisits,
} from "#controllers/visits.controller";
import { authenticationGuard } from "#middleware/authentication/authenticationGuard.middleware";
import { Router } from "express";

const visitsRouter = Router();

visitsRouter.use(authenticationGuard);

visitsRouter.post("/book", bookVisit);
visitsRouter.post("/complete", completeVisit);
visitsRouter.post("/accept", acceptVisit);
visitsRouter.get("/", getAllVisits);

export default visitsRouter;
