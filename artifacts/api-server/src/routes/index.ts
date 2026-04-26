import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coupleRouter from "./couple";
import venuesRouter from "./venues";
import notifyRouter from "./notify";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coupleRouter);
router.use(venuesRouter);
router.use(notifyRouter);

export default router;
