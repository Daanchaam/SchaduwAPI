import matchController from "../controllers/matchController";
import pointController from "../controllers/pointController";
import { Router } from "express";
import serveController from "../controllers/serveController";

const router = Router();

router.post("/start", async (req, res) => {
  try {
    matchController.startMatch(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/addPoint", async (req, res) => {
  try {
    pointController.addPoint(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/addServing", async (req, res) => {
  try {
    serveController.addServing(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
