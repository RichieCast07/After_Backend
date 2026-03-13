import type { Request, Response } from "express";
import type { SellTicketUseCase } from "../../Application/sellTicketUseCase.js";
import type { CreateTicketDTO } from "../../Domain/Data/createTicketDTO.js";

export class SellTicketHandler {
    private readonly sellTicketUseCase: SellTicketUseCase;

    constructor(sellTicketUseCase: SellTicketUseCase) {
        this.sellTicketUseCase = sellTicketUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { cliente_nombre, cliente_telefono, rp_id, evento_id } = req.body as CreateTicketDTO;

            if (!cliente_nombre || !cliente_telefono || !rp_id || !evento_id) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }

            const ticket = await this.sellTicketUseCase.execute({
                cliente_nombre,
                cliente_telefono,
                rp_id,
                evento_id
            });

            res.status(201).json(ticket);
        } catch (error: any) {
            const statusCode = error?.statusCode || 500;
            const message = error?.message || String(error);
            res.status(statusCode).json({ error: message });
        }
    }
}
