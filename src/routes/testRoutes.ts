import Router from "express-promise-router";

const router = Router();

router.get("/", (req, res) => {
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
