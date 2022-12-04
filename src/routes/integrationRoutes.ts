import Router from "express-promise-router";
import MainService from "../services/IntegratorService";

const router = Router();

router.post("/", async (req, res) => {
  const syncOptions = req.body;
  try {
    await MainService.integrate(syncOptions);
    res.send("OK");
  } catch (error) {
    res.status(500).send({ error });
  }
});

export default router;
