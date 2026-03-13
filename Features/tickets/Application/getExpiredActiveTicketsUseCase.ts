import type { Ticket } from "../Domain/Data/ticket.js";
import type { TicketRepository } from "../Domain/Repository/ticketRepository.js";

export class GetExpiredActiveTicketsUseCase {
    private readonly ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(): Promise<Ticket[]> {
        return this.ticketRepository.getExpiredActiveTickets();
    }
}
