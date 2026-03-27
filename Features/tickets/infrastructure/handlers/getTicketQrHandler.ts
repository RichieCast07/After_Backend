import type { Request, Response } from "express";
import QRCode from "qrcode";
import type { GetTicketByCodeUseCase } from "../../Application/getTicketByCodeUseCase.js";

export class GetTicketQrHandler {
    private readonly getTicketByCodeUseCase: GetTicketByCodeUseCase;

    constructor(getTicketByCodeUseCase: GetTicketByCodeUseCase) {
        this.getTicketByCodeUseCase = getTicketByCodeUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { codigo } = req.params;
            const ticket = await this.getTicketByCodeUseCase.execute(codigo);

            if (!ticket) {
                res.status(404).json({ error: "Ticket not found" });
                return;
            }

            const payload = ticket.qr_payload ?? ticket.codigo;
            const pngBuffer = await QRCode.toBuffer(payload, { type: "png", width: 400, margin: 2 });

            res.setHeader("Content-Type", "image/png");
            res.setHeader("Cache-Control", "public, max-age=86400");
            res.send(pngBuffer);
        } catch {
            res.status(500).json({ error: "Failed to generate QR code" });
        }
    }
}
