import type { Request, Response } from "express";
import type { GetPhasesByEventIdHandler } from "./handlers/getPhasesByEventIdHandler.js";
import type { CreatePhaseHandler } from "./handlers/createPhaseHandler.js";
import type { UpdatePhaseHandler } from "./handlers/updatePhaseHandler.js";
import type { TogglePhaseStatusHandler } from "./handlers/togglePhaseStatusHandler.js";

export class PhaseController {
    private readonly getPhasesByEventIdHandler: GetPhasesByEventIdHandler;
    private readonly createPhaseHandler: CreatePhaseHandler;
    private readonly updatePhaseHandler: UpdatePhaseHandler;
    private readonly togglePhaseStatusHandler: TogglePhaseStatusHandler;

    constructor(
        getPhasesByEventIdHandler: GetPhasesByEventIdHandler,
        createPhaseHandler: CreatePhaseHandler,
        updatePhaseHandler: UpdatePhaseHandler,
        togglePhaseStatusHandler: TogglePhaseStatusHandler
    ) {
        this.getPhasesByEventIdHandler = getPhasesByEventIdHandler;
        this.createPhaseHandler = createPhaseHandler;
        this.updatePhaseHandler = updatePhaseHandler;
        this.togglePhaseStatusHandler = togglePhaseStatusHandler;
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
}
