import type { Request, Response } from "express";
import type { GetEventsHandler } from "./handlers/getEventsHandler.js";
import type { GetEventByIdHandler } from "./handlers/getEventByIdHandler.js";
import type { CreateEventHandler } from "./handlers/createEventHandler.js";
import type { UpdateEventHandler } from "./handlers/updateEventHandler.js";
import type { ToggleEventStatusHandler } from "./handlers/toggleEventStatusHandler.js";
import type { EventRepository } from "../Domain/Repository/eventRepository.js";

export class EventController {
    private readonly getEventsHandler: GetEventsHandler;
    private readonly getEventByIdHandler: GetEventByIdHandler;
    private readonly createEventHandler: CreateEventHandler;
    private readonly updateEventHandler: UpdateEventHandler;
    private readonly toggleEventStatusHandler: ToggleEventStatusHandler;
    private readonly eventRepository: EventRepository;

    constructor(
        getEventsHandler: GetEventsHandler,
        getEventByIdHandler: GetEventByIdHandler,
        createEventHandler: CreateEventHandler,
        updateEventHandler: UpdateEventHandler,
        toggleEventStatusHandler: ToggleEventStatusHandler,
        eventRepository: EventRepository
    ) {
        this.getEventsHandler = getEventsHandler;
        this.getEventByIdHandler = getEventByIdHandler;
        this.createEventHandler = createEventHandler;
        this.updateEventHandler = updateEventHandler;
        this.toggleEventStatusHandler = toggleEventStatusHandler;
        this.eventRepository = eventRepository;
    }

    getEvents(req: Request, res: Response): Promise<void> {
        return this.getEventsHandler.handle(req, res);
    }

    getEventById(req: Request, res: Response): Promise<void> {
        return this.getEventByIdHandler.handle(req, res);
    }

    createEvent(req: Request, res: Response): Promise<void> {
        return this.createEventHandler.handle(req, res);
    }

    updateEvent(req: Request, res: Response): Promise<void> {
        return this.updateEventHandler.handle(req, res);
    }

    toggleEventStatus(req: Request, res: Response): Promise<void> {
        return this.toggleEventStatusHandler.handle(req, res);
    }

    async deleteEvent(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, error: "Invalid ID" });
                return;
            }
            await this.eventRepository.deleteEvent(id);
            res.status(200).json({ success: true, message: `Event ${id} deleted successfully` });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
}
