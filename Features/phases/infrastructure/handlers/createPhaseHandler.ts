import type { Request, Response } from "express";
import type { CreatePhaseUseCase } from "../../Application/createPhaseUseCase.js";
import type { CreatePhaseDTO } from "../../Domain/Data/createPhaseDTO.js";

export class CreatePhaseHandler {
    private readonly createPhaseUseCase: CreatePhaseUseCase;

    constructor(createPhaseUseCase: CreatePhaseUseCase) {
        this.createPhaseUseCase = createPhaseUseCase;
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

            const { nombre, precio, fecha_inicio, fecha_fin } = req.body as CreatePhaseDTO;

            if (!nombre || precio === undefined || !fecha_inicio || !fecha_fin) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }

            const phase = await this.createPhaseUseCase.execute(id, {
                nombre,
                precio,
                fecha_inicio: new Date(fecha_inicio),
                fecha_fin: new Date(fecha_fin)
            });

            res.status(201).json(phase);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
