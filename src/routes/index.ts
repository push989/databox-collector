import Router from "express-promise-router";
import testRouter from "./testRoutes";

const router = Router();

router.use("/test", testRouter);

export default router;
