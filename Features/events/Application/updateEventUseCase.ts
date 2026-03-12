import type { Event } from "../Domain/Data/event.js";
import type { EventRepository } from "../Domain/Repository/eventRepository.js";
import type { UpdateEventDTO } from "../Domain/Data/updateEventDTO.js";

export class UpdateEventUseCase {
    private readonly eventRepository: EventRepository;

    constructor(eventRepository: EventRepository) {
        this.eventRepository = eventRepository;
    }

    async execute(eventId: number, event: UpdateEventDTO): Promise<Event> {
        return this.eventRepository.updateEvent(eventId, event);
    }
}
