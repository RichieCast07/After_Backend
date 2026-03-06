import { Router } from "express";
import type { MetricsController } from "../metricsController.js";

export function createMetricsRoutes(metricsController: MetricsController): Router {
    const router = Router();

    router.get("/summary", (req, res) => metricsController.getOverallMetrics(req, res));
    router.get("/rps", (req, res) => metricsController.getRpMetrics(req, res));
    router.get("/event/:eventId", (req, res) => metricsController.getEventMetrics(req, res));
    router.get("/event/:eventId/phases", (req, res) => metricsController.getEventPhaseMetrics(req, res));

    return router;
}
