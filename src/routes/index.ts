import Router from "express-promise-router";
import integrationRouter from "./integrationRoutes";

const router = Router();

router.use("/integration", integrationRouter);

export default router;
