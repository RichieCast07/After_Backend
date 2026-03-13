import type { Request, Response } from "express";
import type { MarkTicketAsUsedUseCase } from "../../Application/markTicketAsUsedUseCase.js";

export class MarkTicketAsUsedHandler {
    private readonly markTicketAsUsedUseCase: MarkTicketAsUsedUseCase;

    constructor(markTicketAsUsedUseCase: MarkTicketAsUsedUseCase) {
        this.markTicketAsUsedUseCase = markTicketAsUsedUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { codigo } = req.params as { codigo?: string };
            
            if (!codigo || typeof codigo !== 'string') {
                res.status(400).json({ error: "Code parameter required" });
                return;
            }

            const ticket = await this.markTicketAsUsedUseCase.execute(codigo);
            res.json(ticket);
        } catch (error: any) {
            const statusCode = error?.statusCode || 500;
            const message = error?.message || String(error);
            res.status(statusCode).json({ error: message });
        }
    }
}
