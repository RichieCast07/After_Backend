import type { Request, Response } from "express";
import type { DeleteTicketByCodeUseCase } from "../../Application/deleteTicketByCodeUseCase.js";

export class DeleteTicketByCodeHandler {
    private readonly deleteTicketByCodeUseCase: DeleteTicketByCodeUseCase;

    constructor(deleteTicketByCodeUseCase: DeleteTicketByCodeUseCase) {
        this.deleteTicketByCodeUseCase = deleteTicketByCodeUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { codigo } = req.params as { codigo?: string };

            if (!codigo || typeof codigo !== "string") {
                res.status(400).json({ error: "Code parameter required" });
                return;
            }

            const deleted = await this.deleteTicketByCodeUseCase.execute(codigo);

            if (!deleted) {
                res.status(404).json({ error: "Ticket not found" });
                return;
            }

            res.json({ success: true, message: "Ticket scanned and removed successfully" });
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
