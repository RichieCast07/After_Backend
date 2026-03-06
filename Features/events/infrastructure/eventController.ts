import type { Request, Response } from "express";
import type { GetEventsHandler } from "./handlers/getEventsHandler.js";
import type { GetEventByIdHandler } from "./handlers/getEventByIdHandler.js";
import type { CreateEventHandler } from "./handlers/createEventHandler.js";
import type { UpdateEventHandler } from "./handlers/updateEventHandler.js";
import type { ToggleEventStatusHandler } from "./handlers/toggleEventStatusHandler.js";

export class EventController {
    private readonly getEventsHandler: GetEventsHandler;
    private readonly getEventByIdHandler: GetEventByIdHandler;
    private readonly createEventHandler: CreateEventHandler;
    private readonly updateEventHandler: UpdateEventHandler;
    private readonly toggleEventStatusHandler: ToggleEventStatusHandler;

    constructor(
        getEventsHandler: GetEventsHandler,
        getEventByIdHandler: GetEventByIdHandler,
        createEventHandler: CreateEventHandler,
        updateEventHandler: UpdateEventHandler,
        toggleEventStatusHandler: ToggleEventStatusHandler
    ) {
        this.getEventsHandler = getEventsHandler;
        this.getEventByIdHandler = getEventByIdHandler;
        this.createEventHandler = createEventHandler;
        this.updateEventHandler = updateEventHandler;
        this.toggleEventStatusHandler = toggleEventStatusHandler;
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
}
