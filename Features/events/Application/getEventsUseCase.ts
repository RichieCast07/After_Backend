import type { Event } from "../Domain/Data/event.js";
import type { EventRepository } from "../Domain/Repository/eventRepository.js";

export class GetEventsUseCase {
    private readonly eventRepository: EventRepository;

    constructor(eventRepository: EventRepository) {
        this.eventRepository = eventRepository;
    }

    async execute(): Promise<Event[]> {
        return this.eventRepository.getEvents();
    }
}
