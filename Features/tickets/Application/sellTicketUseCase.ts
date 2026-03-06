import type { Ticket } from "../Domain/Data/ticket.js";
import type { TicketRepository } from "../Domain/Repository/ticketRepository.js";
import type { CreateTicketDTO } from "../Domain/Data/createTicketDTO.js";

export class SellTicketUseCase {
    private readonly ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(ticket: CreateTicketDTO): Promise<Ticket> {
        return this.ticketRepository.createTicket(ticket);
    }
}
