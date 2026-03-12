import type { Phase } from "../Domain/Data/phase.js";
import type { PhaseRepository } from "../Domain/Repository/phaseRepository.js";

export class GetPhasesByEventIdUseCase {
    private readonly phaseRepository: PhaseRepository;

    constructor(phaseRepository: PhaseRepository) {
        this.phaseRepository = phaseRepository;
    }

    async execute(eventId: number): Promise<Phase[]> {
        return this.phaseRepository.getPhasesByEventId(eventId);
    }
}
