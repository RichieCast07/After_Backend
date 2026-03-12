import type { Event } from "../Domain/Data/event.js";
import type { EventRepository } from "../Domain/Repository/eventRepository.js";
import type { CreateEventDTO } from "../Domain/Data/createEventDTO.js";

export class CreateEventUseCase {
    private readonly eventRepository: EventRepository;

    constructor(eventRepository: EventRepository) {
        this.eventRepository = eventRepository;
    }

    async execute(event: CreateEventDTO): Promise<Event> {
        return this.eventRepository.createEvent(event);
    }
}
