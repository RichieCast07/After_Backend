import type { Phase } from "../Domain/Data/phase.js";
import type { PhaseRepository } from "../Domain/Repository/phaseRepository.js";

export class TogglePhaseStatusUseCase {
    private readonly phaseRepository: PhaseRepository;

    constructor(phaseRepository: PhaseRepository) {
        this.phaseRepository = phaseRepository;
    }

    async execute(phaseId: number): Promise<Phase> {
        return this.phaseRepository.togglePhaseStatus(phaseId);
    }
}
