import Router from "express-promise-router";
import IntegratorService from "../services/IntegratorService";
import fs from "fs";

const router = Router();

router.post("/", async (req, res) => {
  const integrationOptions = req.body;
  const response = await IntegratorService.integrate(integrationOptions);
  res.json(response);
});

router.get("/logs", async (req, res) => {
  const readStream = fs.createReadStream("./logs");
  res.writeHead(200, { "Content-Type": "application/ndjson" });
  readStream.on("open", () => {
    readStream.pipe(res);
  });
});

export default router;
