import type { Ticket } from "../Domain/Data/ticket.js";
import type { TicketRepository } from "../Domain/Repository/ticketRepository.js";

export class GetTicketsByEventIdUseCase {
    private readonly ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(eventId: number): Promise<Ticket[]> {
        return this.ticketRepository.getTicketsByEventId(eventId);
    }
}
