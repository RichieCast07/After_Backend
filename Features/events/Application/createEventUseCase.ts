import type { Event } from "../Domain/Data/event.js";
import type { EventRepository } from "../Domain/Repository/eventRepository.js";
import type { CreateEventDTO } from "../Domain/Data/createEventDTO.js";
import type { PhaseRepository } from "../../phases/Domain/Repository/phaseRepository.js";

export class CreateEventUseCase {
    private readonly eventRepository: EventRepository;
    private readonly phaseRepository: PhaseRepository;

    constructor(eventRepository: EventRepository, phaseRepository: PhaseRepository) {
        this.eventRepository = eventRepository;
        this.phaseRepository = phaseRepository;
    }

    async execute(event: CreateEventDTO): Promise<Event> {
        const createdEvent = await this.eventRepository.createEvent(event);

        await this.phaseRepository.createPhase(createdEvent.id, {
            nombre: "Fase 1",
            precio: event.precio_inicial,
            fecha_inicio: new Date(),
            fecha_fin: new Date(event.fecha_evento),
        });

        return createdEvent;
    }
}
