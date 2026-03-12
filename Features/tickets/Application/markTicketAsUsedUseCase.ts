import type { Ticket } from "../Domain/Data/ticket.js";
import type { TicketRepository } from "../Domain/Repository/ticketRepository.js";

export class MarkTicketAsUsedUseCase {
    private readonly ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(code: string): Promise<Ticket> {
        return this.ticketRepository.markAsUsed(code);
    }
}
