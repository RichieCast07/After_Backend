import type { Application } from "express";
import { Router } from "express";
import type { PhaseController } from "./phaseController.js";

export function registerPhasesRoutes(app: Application, phaseController: PhaseController): void {
    const phaseRouter = Router({ mergeParams: true });

    phaseRouter.get("/:eventId/phases", (req, res) => phaseController.getPhasesByEventId(req, res));
    phaseRouter.post("/:eventId/phases", (req, res) => phaseController.createPhase(req, res));
    phaseRouter.put("/:eventId/phases/:phaseId", (req, res) => phaseController.updatePhase(req, res));
    phaseRouter.patch("/:eventId/phases/:phaseId/toggle", (req, res) => phaseController.togglePhaseStatus(req, res));

    app.use("/events", phaseRouter);
}
