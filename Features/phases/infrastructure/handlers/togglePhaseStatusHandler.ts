import type { Request, Response } from "express";
import type { TogglePhaseStatusUseCase } from "../../Application/togglePhaseStatusUseCase.js";

export class TogglePhaseStatusHandler {
    private readonly togglePhaseStatusUseCase: TogglePhaseStatusUseCase;

    constructor(togglePhaseStatusUseCase: TogglePhaseStatusUseCase) {
        this.togglePhaseStatusUseCase = togglePhaseStatusUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { phaseId } = req.params as { phaseId?: string };
            
            if (!phaseId || typeof phaseId !== 'string') {
                res.status(400).json({ error: "Phase ID parameter required" });
                return;
            }
            
            const id = parseInt(phaseId, 10);

            if (isNaN(id)) {
                res.status(400).json({ error: "Invalid phase ID" });
                return;
            }

            const phase = await this.togglePhaseStatusUseCase.execute(id);
            res.json(phase);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
