import type { Request, Response } from "express";
import type { UpdatePhaseUseCase } from "../../Application/updatePhaseUseCase.js";
import type { UpdatePhaseDTO } from "../../Domain/Data/updatePhaseDTO.js";

export class UpdatePhaseHandler {
    private readonly updatePhaseUseCase: UpdatePhaseUseCase;

    constructor(updatePhaseUseCase: UpdatePhaseUseCase) {
        this.updatePhaseUseCase = updatePhaseUseCase;
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

            const updates = req.body as UpdatePhaseDTO;

            if (updates.fecha_inicio) {
                updates.fecha_inicio = new Date(updates.fecha_inicio);
            }
            if (updates.fecha_fin) {
                updates.fecha_fin = new Date(updates.fecha_fin);
            }

            const phase = await this.updatePhaseUseCase.execute(id, updates);
            res.json(phase);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
