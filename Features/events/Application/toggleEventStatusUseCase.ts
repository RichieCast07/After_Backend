import type { Event } from "../Domain/Data/event.js";
import type { EventRepository } from "../Domain/Repository/eventRepository.js";

export class ToggleEventStatusUseCase {
    private readonly eventRepository: EventRepository;

    constructor(eventRepository: EventRepository) {
        this.eventRepository = eventRepository;
    }

    async execute(eventId: number): Promise<Event> {
        return this.eventRepository.toggleEventStatus(eventId);
    }
}
