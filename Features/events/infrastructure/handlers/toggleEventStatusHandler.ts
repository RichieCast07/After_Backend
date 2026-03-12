import type { Request, Response } from "express";
import type { ToggleEventStatusUseCase } from "../../Application/toggleEventStatusUseCase.js";

export class ToggleEventStatusHandler {
    private readonly toggleEventStatusUseCase: ToggleEventStatusUseCase;

    constructor(toggleEventStatusUseCase: ToggleEventStatusUseCase) {
        this.toggleEventStatusUseCase = toggleEventStatusUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id?: string };
            
            if (!id || typeof id !== 'string') {
                res.status(400).json({ error: "Event ID parameter required" });
                return;
            }
            
            const eventId = parseInt(id, 10);

            if (isNaN(eventId)) {
                res.status(400).json({ error: "Invalid event ID" });
                return;
            }

            const event = await this.toggleEventStatusUseCase.execute(eventId);
            res.json(event);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
