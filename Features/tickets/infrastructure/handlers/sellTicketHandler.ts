import type { Request, Response } from "express";
import type { SellTicketUseCase } from "../../Application/sellTicketUseCase.js";
import type { CreateTicketDTO } from "../../Domain/Data/createTicketDTO.js";
import { withPublicTicketUrl } from "../presenters/ticketPublicPresenter.js";

export class SellTicketHandler {
    private readonly sellTicketUseCase: SellTicketUseCase;

    constructor(sellTicketUseCase: SellTicketUseCase) {
        this.sellTicketUseCase = sellTicketUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const body = (req.body ?? {}) as Record<string, unknown>;
            const cliente_nombre = String(
                body.cliente_nombre ?? body.nombre_cliente ?? body.client_name ?? ""
            ).trim();
            const cliente_telefono = String(
                body.cliente_telefono ?? body.telefono_cliente ?? body.telefono ?? body.phone ?? ""
            ).trim();
            const rp_id = Number(body.rp_id ?? body.rpId ?? body.user_id ?? body.usuario_id);
            const evento_id = Number(body.evento_id ?? body.eventoId ?? body.event_id);
            const precio = Number(body.precio ?? body.price ?? body.precio_boleto);
            const tipo_boleto = String(body.tipo_boleto ?? body.tipoBoleto ?? body.ticket_type ?? "GENERAL").trim();
            const missingFields: string[] = [];

            if (!cliente_nombre) {
                missingFields.push("cliente_nombre");
            }

            if (!cliente_telefono) {
                missingFields.push("cliente_telefono");
            }

            if (!Number.isFinite(rp_id) || rp_id <= 0) {
                missingFields.push("rp_id");
            }

            if (!Number.isFinite(evento_id) || evento_id <= 0) {
                missingFields.push("evento_id");
            }

            if (missingFields.length > 0) {
                res.status(400).json({
                    error: "Missing required fields",
                    details: missingFields,
                    received: req.body ?? null
                });
                return;
            }

            const ticket = await this.sellTicketUseCase.execute({
                cliente_nombre,
                cliente_telefono,
                rp_id,
                evento_id,
                tipo_boleto: tipo_boleto || "GENERAL",
                precio: Number.isFinite(precio) && precio > 0 ? precio : undefined
            } as CreateTicketDTO);

            res.status(201).json(withPublicTicketUrl(ticket));
        } catch (error: any) {
            const statusCode = error?.statusCode || 500;
            const message = error?.message || String(error);
            res.status(statusCode).json({ error: message });
        }
    }
}
