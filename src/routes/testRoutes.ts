import Router from "express-promise-router";
import DataboxIntegrationService from "../integrations/databox/DataboxIntegrationService";

const router = Router();

router.get("/", async (req, res) => {
  await DataboxIntegrationService.pushMetrics([
    {
      name: "Sales",
      value: 420,
      date: new Date(),
    },
    {
      name: "Orders",
      value: 1,
    },
  ]);

  res.send("Hello World");
});

router.post("/:id", (req, res) => {
  const result = {
    id: req.params.id,
    body: req.body,
    headers: req.headers,
  };

  res.json(result);
});

export default router;
