import type { Request, Response } from "express";
import type { GetTicketsByEventIdUseCase } from "../../Application/getTicketsByEventIdUseCase.js";
import { withPublicTicketUrls } from "../presenters/ticketPublicPresenter.js";

export class GetTicketsByEventIdHandler {
    private readonly getTicketsByEventIdUseCase: GetTicketsByEventIdUseCase;

    constructor(getTicketsByEventIdUseCase: GetTicketsByEventIdUseCase) {
        this.getTicketsByEventIdUseCase = getTicketsByEventIdUseCase;
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

            const tickets = await this.getTicketsByEventIdUseCase.execute(id);
            res.json(withPublicTicketUrls(tickets));
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
