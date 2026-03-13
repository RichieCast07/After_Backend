import { Router } from "express";
import type { TicketController } from "../ticketController.js";

export function createTicketsRoutes(ticketController: TicketController): Router {
    const router = Router();

    router.post("/", (req, res) => ticketController.sellTicket(req, res));
    router.get("/expired-active", (req, res) => ticketController.getExpiredActiveTickets(req, res));
    router.get("/event/:eventId", (req, res) => ticketController.getTicketsByEventId(req, res));
    router.get("/rp/:rpId", (req, res) => ticketController.getTicketsByRpId(req, res));
    router.get("/:codigo/qr", (req, res) => ticketController.getTicketQr(req, res));
    router.get("/:codigo", (req, res) => ticketController.getTicketByCode(req, res));
    router.patch("/:codigo/use", (req, res) => ticketController.markTicketAsUsed(req, res));
    router.delete("/:codigo", (req, res) => ticketController.deleteTicketByCode(req, res));

    return router;
}
