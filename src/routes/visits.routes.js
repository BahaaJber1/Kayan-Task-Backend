import { bookVisit } from "#controllers/visits.controller";
import { Router } from "express";

const visitsRouter = Router();

visitsRouter.post("/book", bookVisit);

export default visitsRouter;
