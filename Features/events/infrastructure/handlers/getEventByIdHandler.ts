import type { Request, Response } from "express";
import type { GetEventByIdUseCase } from "../../Application/getEventByIdUseCase.js";

export class GetEventByIdHandler {
    private readonly getEventByIdUseCase: GetEventByIdUseCase;

    constructor(getEventByIdUseCase: GetEventByIdUseCase) {
        this.getEventByIdUseCase = getEventByIdUseCase;
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

            const event = await this.getEventByIdUseCase.execute(eventId);

            if (!event) {
                res.status(404).json({ error: "Event not found" });
                return;
            }

            res.json(event);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
