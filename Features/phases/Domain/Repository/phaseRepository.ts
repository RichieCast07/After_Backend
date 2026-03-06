import type { Phase } from "../Data/phase.js";
import type { CreatePhaseDTO } from "../Data/createPhaseDTO.js";
import type { UpdatePhaseDTO } from "../Data/updatePhaseDTO.js";

export abstract class PhaseRepository {
    abstract getPhasesByEventId(eventId: number): Promise<Phase[]>;

    abstract getPhaseById(phaseId: number): Promise<Phase | null>;

    abstract createPhase(eventId: number, phase: CreatePhaseDTO): Promise<Phase>;

    abstract updatePhase(phaseId: number, phase: UpdatePhaseDTO): Promise<Phase>;

    abstract togglePhaseStatus(phaseId: number): Promise<Phase>;

    abstract deletePhase(phaseId: number): Promise<void>;
}
