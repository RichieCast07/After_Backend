import { Router } from "express";
import type { TicketTypesController } from "../ticketTypesController.js";

export function createTicketTypesRoutes(controller: TicketTypesController): Router {
    const router = Router({ mergeParams: true });

    router.get("/:eventId/ticket-types", (req, res) => controller.getEventTicketTypes(req, res));
    router.post("/:eventId/ticket-types", (req, res) => controller.createEventTicketType(req, res));
    router.put("/:eventId/ticket-types/:ticketTypeId", (req, res) => controller.updateEventTicketType(req, res));

    router.get("/:eventId/phases/:phaseId/ticket-types", (req, res) => controller.getPhaseTicketTypePrices(req, res));
    router.put("/:eventId/phases/:phaseId/ticket-types/:ticketTypeId", (req, res) => controller.updatePhaseTicketTypePrice(req, res));

    return router;
}
