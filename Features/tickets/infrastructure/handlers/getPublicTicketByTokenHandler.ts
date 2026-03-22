import type { Request, Response } from "express";
import type { GetTicketByCodeUseCase } from "../../Application/getTicketByCodeUseCase.js";
import { verifyPublicTicketToken } from "../security/publicTicketLink.js";

export class GetPublicTicketByTokenHandler {
    private readonly getTicketByCodeUseCase: GetTicketByCodeUseCase;

    constructor(getTicketByCodeUseCase: GetTicketByCodeUseCase) {
        this.getTicketByCodeUseCase = getTicketByCodeUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.params as { token?: string };

            if (!token || typeof token !== "string") {
                res.status(400).json({ error: "Token parameter required" });
                return;
            }

            const signedPayload = verifyPublicTicketToken(token);
            if (!signedPayload) {
                res.status(401).json({ error: "Invalid public ticket token" });
                return;
            }

            const ticket = await this.getTicketByCodeUseCase.execute(signedPayload.codigo);

            if (!ticket) {
                res.status(404).json({ error: "Ticket not found" });
                return;
            }

            const ticketEventCode = String(ticket.codigo_evento ?? "").trim().toUpperCase();
            const signedEventCode = String(signedPayload.codigo_evento).trim().toUpperCase();

            if (ticket.rp_id !== signedPayload.rp_id || ticketEventCode !== signedEventCode) {
                res.status(403).json({ error: "Public ticket token does not match ticket data" });
                return;
            }

            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}