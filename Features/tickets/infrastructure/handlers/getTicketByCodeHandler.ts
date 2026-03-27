import type { Request, Response } from "express";
import type { GetTicketByCodeUseCase } from "../../Application/getTicketByCodeUseCase.js";
import { withPublicTicketUrl } from "../presenters/ticketPublicPresenter.js";

export class GetTicketByCodeHandler {
    private readonly getTicketByCodeUseCase: GetTicketByCodeUseCase;

    constructor(getTicketByCodeUseCase: GetTicketByCodeUseCase) {
        this.getTicketByCodeUseCase = getTicketByCodeUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { codigo } = req.params as { codigo?: string };
            
            if (!codigo || typeof codigo !== 'string') {
                res.status(400).json({ error: "Code parameter required" });
                return;
            }

            const ticket = await this.getTicketByCodeUseCase.execute(codigo);

            if (!ticket) {
                res.status(404).json({ error: "Ticket not found" });
                return;
            }

            res.json(withPublicTicketUrl(ticket));
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
