import type { Request, Response } from "express";
import type { GetTicketsByRpIdUseCase } from "../../Application/getTicketsByRpIdUseCase.js";
import { withPublicTicketUrls } from "../presenters/ticketPublicPresenter.js";

export class GetTicketsByRpIdHandler {
    private readonly getTicketsByRpIdUseCase: GetTicketsByRpIdUseCase;

    constructor(getTicketsByRpIdUseCase: GetTicketsByRpIdUseCase) {
        this.getTicketsByRpIdUseCase = getTicketsByRpIdUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { rpId } = req.params as { rpId?: string };
            
            if (!rpId || typeof rpId !== 'string') {
                res.status(400).json({ error: "RP ID parameter required" });
                return;
            }
            
            const id = parseInt(rpId, 10);

            if (isNaN(id)) {
                res.status(400).json({ error: "Invalid RP ID" });
                return;
            }

            const tickets = await this.getTicketsByRpIdUseCase.execute(id);
            res.json(withPublicTicketUrls(tickets));
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
