import type { Phase } from "../Domain/Data/phase.js";
import type { PhaseRepository } from "../Domain/Repository/phaseRepository.js";
import type { CreatePhaseDTO } from "../Domain/Data/createPhaseDTO.js";

export class CreatePhaseUseCase {
    private readonly phaseRepository: PhaseRepository;

    constructor(phaseRepository: PhaseRepository) {
        this.phaseRepository = phaseRepository;
    }

    async execute(eventId: number, phase: CreatePhaseDTO): Promise<Phase> {
        return this.phaseRepository.createPhase(eventId, phase);
    }
}
