import type { Request, Response } from "express";
import type { UpdateEventUseCase } from "../../Application/updateEventUseCase.js";
import type { UpdateEventDTO } from "../../Domain/Data/updateEventDTO.js";

export class UpdateEventHandler {
    private readonly updateEventUseCase: UpdateEventUseCase;

    constructor(updateEventUseCase: UpdateEventUseCase) {
        this.updateEventUseCase = updateEventUseCase;
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

            const updates = req.body as UpdateEventDTO;

            if (updates.fecha_evento) {
                updates.fecha_evento = new Date(updates.fecha_evento);
            }

            const event = await this.updateEventUseCase.execute(eventId, updates);
            res.json(event);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
