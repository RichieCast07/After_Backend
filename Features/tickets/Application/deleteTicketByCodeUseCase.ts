import type { TicketRepository } from "../Domain/Repository/ticketRepository.js";

export class DeleteTicketByCodeUseCase {
    private readonly ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;
    }

    async execute(code: string): Promise<boolean> {
        return this.ticketRepository.deleteByCode(code);
    }
}
