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
            const { codigo, cliente_id, rp_id, evento_id, fase_id, precio, comision_rp } = req.body as CreateTicketDTO;

            if (!codigo || !cliente_id || !rp_id || !evento_id || !fase_id || precio === undefined) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }

            const ticket = await this.sellTicketUseCase.execute({
                codigo,
                cliente_id,
                rp_id,
                evento_id,
                fase_id,
                precio,
                comision_rp: comision_rp || 0
            });

            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
