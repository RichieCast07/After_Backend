import { Router } from "express";
import type { EventController } from "../eventController.js";

export function createEventsRoutes(eventController: EventController): Router {
    const router = Router();

    router.get("/", (req, res) => eventController.getEvents(req, res));
    router.post("/", (req, res) => eventController.createEvent(req, res));
    router.delete("/:id", (req, res) => eventController.deleteEvent(req, res));
    router.get("/:id", (req, res) => eventController.getEventById(req, res));
    router.put("/:id", (req, res) => eventController.updateEvent(req, res));
    router.patch("/:id/toggle", (req, res) => eventController.toggleEventStatus(req, res));

    return router;
}
