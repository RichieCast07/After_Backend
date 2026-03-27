import type { Ticket } from "../Data/ticket.js";
import type { CreateTicketDTO } from "../Data/createTicketDTO.js";

export abstract class TicketRepository {
    abstract createTicket(ticket: CreateTicketDTO): Promise<Ticket>;

    abstract existsByClientAndEvent(clientId: number, eventId: number): Promise<boolean>;

    abstract getTicketByCode(code: string): Promise<Ticket | null>;

    abstract markAsUsed(ticketCode: string): Promise<Ticket>;

    abstract getTicketsByEventId(eventId: number): Promise<Ticket[]>;

    abstract getTicketsByRpId(rpId: number): Promise<Ticket[]>;

    abstract getExpiredActiveTickets(): Promise<Ticket[]>;

    abstract deleteByCode(code: string): Promise<boolean>;
}
