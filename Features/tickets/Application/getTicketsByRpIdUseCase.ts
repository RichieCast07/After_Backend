import type { Ticket } from "../Domain/Data/ticket.js";
import type { TicketRepository } from "../Domain/Repository/ticketRepository.js";

export class GetTicketsByRpIdUseCase {
    private readonly ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(rpId: number): Promise<Ticket[]> {
        return this.ticketRepository.getTicketsByRpId(rpId);
    }
}
