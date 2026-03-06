import type { Request, Response } from "express";
import type { GetPhasesByEventIdUseCase } from "../../Application/getPhasesByEventIdUseCase.js";

export class GetPhasesByEventIdHandler {
    private readonly getPhasesByEventIdUseCase: GetPhasesByEventIdUseCase;

    constructor(getPhasesByEventIdUseCase: GetPhasesByEventIdUseCase) {
        this.getPhasesByEventIdUseCase = getPhasesByEventIdUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { eventId } = req.params as { eventId?: string };
            
            if (!eventId || typeof eventId !== 'string') {
                res.status(400).json({ error: "Event ID parameter required" });
                return;
            }
            
            const id = parseInt(eventId, 10);

            if (isNaN(id)) {
                res.status(400).json({ error: "Invalid event ID" });
                return;
            }

            const phases = await this.getPhasesByEventIdUseCase.execute(id);
            res.json(phases);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
