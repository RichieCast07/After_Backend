import { Router } from "express";
import type { PhaseController } from "../phaseController.js";

export function createPhasesRoutes(phaseController: PhaseController): Router {
    const router = Router({ mergeParams: true });

    router.get("/", (req, res) => phaseController.getPhasesByEventId(req, res));
    router.post("/", (req, res) => phaseController.createPhase(req, res));
    router.delete("/:phaseId", (req, res) => phaseController.deletePhase(req, res));
    router.put("/:phaseId", (req, res) => phaseController.updatePhase(req, res));
    router.patch("/:phaseId/toggle", (req, res) => phaseController.togglePhaseStatus(req, res));

    return router;
}
