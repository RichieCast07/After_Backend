import type { Request, Response } from "express";
import type { GetPhasesByEventIdHandler } from "./handlers/getPhasesByEventIdHandler.js";
import type { CreatePhaseHandler } from "./handlers/createPhaseHandler.js";
import type { UpdatePhaseHandler } from "./handlers/updatePhaseHandler.js";
import type { TogglePhaseStatusHandler } from "./handlers/togglePhaseStatusHandler.js";
import type { PhaseRepository } from "../Domain/Repository/phaseRepository.js";

export class PhaseController {
    private readonly getPhasesByEventIdHandler: GetPhasesByEventIdHandler;
    private readonly createPhaseHandler: CreatePhaseHandler;
    private readonly updatePhaseHandler: UpdatePhaseHandler;
    private readonly togglePhaseStatusHandler: TogglePhaseStatusHandler;
    private readonly phaseRepository: PhaseRepository;

    constructor(
        getPhasesByEventIdHandler: GetPhasesByEventIdHandler,
        createPhaseHandler: CreatePhaseHandler,
        updatePhaseHandler: UpdatePhaseHandler,
        togglePhaseStatusHandler: TogglePhaseStatusHandler,
        phaseRepository: PhaseRepository
    ) {
        this.getPhasesByEventIdHandler = getPhasesByEventIdHandler;
        this.createPhaseHandler = createPhaseHandler;
        this.updatePhaseHandler = updatePhaseHandler;
        this.togglePhaseStatusHandler = togglePhaseStatusHandler;
        this.phaseRepository = phaseRepository;
    }

    getPhasesByEventId(req: Request, res: Response): Promise<void> {
        return this.getPhasesByEventIdHandler.handle(req, res);
    }

    createPhase(req: Request, res: Response): Promise<void> {
        return this.createPhaseHandler.handle(req, res);
    }

    updatePhase(req: Request, res: Response): Promise<void> {
        return this.updatePhaseHandler.handle(req, res);
    }

    togglePhaseStatus(req: Request, res: Response): Promise<void> {
        return this.togglePhaseStatusHandler.handle(req, res);
    }

    async deletePhase(req: Request, res: Response): Promise<void> {
        try {
            const phaseId = Number(req.params.phaseId);
            if (isNaN(phaseId)) {
                res.status(400).json({ success: false, error: "Invalid phase ID" });
                return;
            }
            await this.phaseRepository.deletePhase(phaseId);
            res.status(200).json({ success: true, message: `Phase ${phaseId} deleted successfully` });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
}
