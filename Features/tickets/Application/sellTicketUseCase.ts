import type { Ticket } from "../Domain/Data/ticket.js";
import type { TicketRepository } from "../Domain/Repository/ticketRepository.js";
import type { CreateTicketDTO } from "../Domain/Data/createTicketDTO.js";
import type { ClientRepository } from "../../clients/Domain/Repository/clientRepository.js";
import type { PhaseRepository } from "../../phases/Domain/Repository/phaseRepository.js";
import type { EventRepository } from "../../events/Domain/Repository/eventRepository.js";

export class SellTicketUseCase {
    private readonly ticketRepository: TicketRepository;
    private readonly clientRepository: ClientRepository;
    private readonly phaseRepository: PhaseRepository;
    private readonly eventRepository: EventRepository;

    constructor(
        ticketRepository: TicketRepository,
        clientRepository: ClientRepository,
        phaseRepository: PhaseRepository,
        eventRepository: EventRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.clientRepository = clientRepository;
        this.phaseRepository = phaseRepository;
        this.eventRepository = eventRepository;
    }

    async execute(ticket: CreateTicketDTO): Promise<Ticket> {
        const now = new Date();
        const cleanPhone = String(ticket.cliente_telefono ?? "").trim();
        const cleanName = String(ticket.cliente_nombre ?? "").trim();

        if (!ticket.codigo || !ticket.rp_id || !ticket.evento_id || !cleanName || !cleanPhone) {
            const error = new Error("Missing required fields");
            (error as any).statusCode = 400;
            throw error;
        }

        const event = await this.eventRepository.getEventById(ticket.evento_id);
        if (!event) {
            const error = new Error("Selected event does not exist");
            (error as any).statusCode = 400;
            throw error;
        }

        if (!event.activo) {
            const error = new Error("Cannot sell tickets for an inactive event");
            (error as any).statusCode = 400;
            throw error;
        }

        let client = await this.clientRepository.getClientByPhone(cleanPhone);
        if (!client) {
            client = await this.clientRepository.createClient({
                nombre_completo: cleanName,
                telefono: cleanPhone
            });
        }

        const phases = await this.phaseRepository.getPhasesByEventId(ticket.evento_id);
        const activePhase = phases.find((phase) => {
            const startsAt = new Date(phase.fecha_inicio);
            const endsAt = new Date(phase.fecha_fin);
            return Boolean(phase.activa) && now >= startsAt && now <= endsAt;
        });

        if (!activePhase) {
            const error = new Error("No active phase found for current date and time");
            (error as any).statusCode = 400;
            throw error;
        }

        const price = Number(activePhase.precio);
        const commission = Number((price * 0.1).toFixed(2));

        return this.ticketRepository.createTicket({
            codigo: ticket.codigo,
            cliente_nombre: cleanName,
            cliente_telefono: cleanPhone,
            cliente_id: client.id,
            rp_id: ticket.rp_id,
            evento_id: ticket.evento_id,
            fase_id: activePhase.id,
            precio: price,
            comision_rp: commission
        });
    }
}
