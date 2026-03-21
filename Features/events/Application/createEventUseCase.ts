import type { PhaseRepository } from "../../phases/Domain/Repository/phaseRepository.js";
import type { TicketTypeRepository } from "../../ticketTypes/Domain/Repository/ticketTypeRepository.js";
import type { CreateEventDTO } from "../Domain/Data/createEventDTO.js";
import type { Event } from "../Domain/Data/event.js";
import type { EventRepository } from "../Domain/Repository/eventRepository.js";

export class CreateEventUseCase {
    private readonly eventRepository: EventRepository;
    private readonly phaseRepository: PhaseRepository;
    private readonly ticketTypeRepository: TicketTypeRepository;

    constructor(eventRepository: EventRepository, phaseRepository: PhaseRepository, ticketTypeRepository: TicketTypeRepository) {
        this.eventRepository = eventRepository;
        this.phaseRepository = phaseRepository;
        this.ticketTypeRepository = ticketTypeRepository;
    }

    async execute(event: CreateEventDTO): Promise<Event> {
        const createdEvent = await this.eventRepository.createEvent(event);

        const phase = await this.phaseRepository.createPhase(createdEvent.id, {
            nombre: "Fase 1",
            precio: event.precio_inicial,
            fecha_inicio: new Date(),
            fecha_fin: new Date(event.fecha_evento),
        });

        await this.ticketTypeRepository.createDefaultGeneralType(createdEvent.id, phase.id, Number(event.precio_inicial));

        return createdEvent;
    }
}
