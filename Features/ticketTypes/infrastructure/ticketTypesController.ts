import type { Request, Response } from "express";
import type { TicketTypeRepository } from "../Domain/Repository/ticketTypeRepository.js";

export class TicketTypesController {
    private readonly repository: TicketTypeRepository;

    constructor(repository: TicketTypeRepository) {
        this.repository = repository;
    }

    async getEventTicketTypes(req: Request, res: Response): Promise<void> {
        try {
            const eventId = Number(req.params.eventId);
            if (!Number.isFinite(eventId) || eventId <= 0) {
                res.status(400).json({ error: "Invalid event ID" });
                return;
            }

            const types = await this.repository.getTicketTypesByEventId(eventId);
            res.status(200).json(types);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }

    async createEventTicketType(req: Request, res: Response): Promise<void> {
        try {
            const eventId = Number(req.params.eventId);
            const nombre = String(req.body?.nombre ?? "");
            const initialPriceRaw = req.body?.precio_inicial;

            if (!Number.isFinite(eventId) || eventId <= 0) {
                res.status(400).json({ error: "Invalid event ID" });
                return;
            }

            if (!nombre.trim()) {
                res.status(400).json({ error: "Nombre is required" });
                return;
            }

            const initialPrice = initialPriceRaw !== undefined && initialPriceRaw !== null && initialPriceRaw !== ""
                ? Number(initialPriceRaw)
                : undefined;

            if (initialPrice !== undefined && (!Number.isFinite(initialPrice) || initialPrice < 0)) {
                res.status(400).json({ error: "Invalid precio_inicial" });
                return;
            }

            const created = await this.repository.createTicketType(eventId, nombre, initialPrice);
            res.status(201).json(created);
        } catch (error: any) {
            res.status(400).json({ error: error?.message ?? String(error) });
        }
    }

    async updateEventTicketType(req: Request, res: Response): Promise<void> {
        try {
            const eventId = Number(req.params.eventId);
            const ticketTypeId = Number(req.params.ticketTypeId);

            if (!Number.isFinite(eventId) || eventId <= 0 || !Number.isFinite(ticketTypeId) || ticketTypeId <= 0) {
                res.status(400).json({ error: "Invalid IDs" });
                return;
            }

            const updated = await this.repository.updateTicketType(eventId, ticketTypeId, {
                nombre: req.body?.nombre,
                activo: req.body?.activo,
            });
            res.status(200).json(updated);
        } catch (error: any) {
            res.status(400).json({ error: error?.message ?? String(error) });
        }
    }

    async getPhaseTicketTypePrices(req: Request, res: Response): Promise<void> {
        try {
            const eventId = Number(req.params.eventId);
            const phaseId = Number(req.params.phaseId);

            if (!Number.isFinite(eventId) || eventId <= 0 || !Number.isFinite(phaseId) || phaseId <= 0) {
                res.status(400).json({ error: "Invalid IDs" });
                return;
            }

            const prices = await this.repository.getPhaseTicketTypePrices(eventId, phaseId);
            res.status(200).json(prices);
        } catch (error: any) {
            res.status(400).json({ error: error?.message ?? String(error) });
        }
    }

    async updatePhaseTicketTypePrice(req: Request, res: Response): Promise<void> {
        try {
            const eventId = Number(req.params.eventId);
            const phaseId = Number(req.params.phaseId);
            const ticketTypeId = Number(req.params.ticketTypeId);
            const precio = Number(req.body?.precio);

            if (
                !Number.isFinite(eventId) || eventId <= 0 ||
                !Number.isFinite(phaseId) || phaseId <= 0 ||
                !Number.isFinite(ticketTypeId) || ticketTypeId <= 0
            ) {
                res.status(400).json({ error: "Invalid IDs" });
                return;
            }

            if (!Number.isFinite(precio) || precio < 0) {
                res.status(400).json({ error: "Invalid precio" });
                return;
            }

            const updated = await this.repository.updatePhaseTicketTypePrice(eventId, phaseId, ticketTypeId, precio);
            res.status(200).json(updated);
        } catch (error: any) {
            res.status(400).json({ error: error?.message ?? String(error) });
        }
    }
}
