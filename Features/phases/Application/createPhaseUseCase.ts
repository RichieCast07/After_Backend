import type { TicketTypeRepository } from "../../ticketTypes/Domain/Repository/ticketTypeRepository.js";
import type { CreatePhaseDTO } from "../Domain/Data/createPhaseDTO.js";
import type { Phase } from "../Domain/Data/phase.js";
import type { PhaseRepository } from "../Domain/Repository/phaseRepository.js";

export class CreatePhaseUseCase {
    private readonly phaseRepository: PhaseRepository;
    private readonly ticketTypeRepository: TicketTypeRepository;

    constructor(phaseRepository: PhaseRepository, ticketTypeRepository: TicketTypeRepository) {
        this.phaseRepository = phaseRepository;
        this.ticketTypeRepository = ticketTypeRepository;
    }

    async execute(eventId: number, phase: CreatePhaseDTO): Promise<Phase> {
        const created = await this.phaseRepository.createPhase(eventId, phase);
        await this.ticketTypeRepository.seedPhasePricesForNewPhase(eventId, created.id);
        return created;
    }
}
