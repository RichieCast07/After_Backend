import type { PhaseTicketTypePrice, TicketType } from "../Data/ticketType.js";

export abstract class TicketTypeRepository {
    abstract getTicketTypesByEventId(eventId: number): Promise<TicketType[]>;

    abstract createTicketType(eventId: number, nombre: string, initialPrice?: number): Promise<TicketType>;

    abstract updateTicketType(eventId: number, ticketTypeId: number, data: { nombre?: string; activo?: boolean }): Promise<TicketType>;

    abstract getPhaseTicketTypePrices(eventId: number, phaseId: number): Promise<PhaseTicketTypePrice[]>;

    abstract updatePhaseTicketTypePrice(eventId: number, phaseId: number, ticketTypeId: number, precio: number): Promise<PhaseTicketTypePrice>;

    abstract seedPhasePricesForNewPhase(eventId: number, phaseId: number): Promise<void>;

    abstract createDefaultGeneralType(eventId: number, phaseId: number, precio: number): Promise<void>;

    abstract getPriceForPhaseAndType(eventId: number, phaseId: number, typeName: string): Promise<number | null>;
}