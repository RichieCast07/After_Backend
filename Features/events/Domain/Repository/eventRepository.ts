import type { Event } from "../Data/event.js";
import type { CreateEventDTO } from "../Data/createEventDTO.js";
import type { UpdateEventDTO } from "../Data/updateEventDTO.js";

export abstract class EventRepository {
    abstract getEvents(): Promise<Event[]>;

    abstract getEventById(eventId: number): Promise<Event | null>;

    abstract createEvent(event: CreateEventDTO): Promise<Event>;

    abstract updateEvent(eventId: number, event: UpdateEventDTO): Promise<Event>;

    abstract toggleEventStatus(eventId: number): Promise<Event>;

    abstract deleteEvent(eventId: number): Promise<void>;
}
