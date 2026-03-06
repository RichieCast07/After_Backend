import type { Phase } from "../Domain/Data/phase.js";
import type { PhaseRepository } from "../Domain/Repository/phaseRepository.js";
import type { UpdatePhaseDTO } from "../Domain/Data/updatePhaseDTO.js";

export class UpdatePhaseUseCase {
    private readonly phaseRepository: PhaseRepository;

    constructor(phaseRepository: PhaseRepository) {
        this.phaseRepository = phaseRepository;
    }

    async execute(phaseId: number, phase: UpdatePhaseDTO): Promise<Phase> {
        return this.phaseRepository.updatePhase(phaseId, phase);
    }
}
