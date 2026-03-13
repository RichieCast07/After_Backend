import type { Ticket } from "../Domain/Data/ticket.js";
import type { TicketRepository } from "../Domain/Repository/ticketRepository.js";
import type { CreateTicketDTO } from "../Domain/Data/createTicketDTO.js";
import type { ClientRepository } from "../../clients/Domain/Repository/clientRepository.js";
import type { PhaseRepository } from "../../phases/Domain/Repository/phaseRepository.js";
import type { EventRepository } from "../../events/Domain/Repository/eventRepository.js";
import { randomBytes } from "node:crypto";
import type { WhatsappService } from "../../../Core/Whatsapp/whatsappService.js";

export class SellTicketUseCase {
    private readonly ticketRepository: TicketRepository;
    private readonly clientRepository: ClientRepository;
    private readonly phaseRepository: PhaseRepository;
    private readonly eventRepository: EventRepository;
    private readonly whatsappService?: WhatsappService;

    constructor(
        ticketRepository: TicketRepository,
        clientRepository: ClientRepository,
        phaseRepository: PhaseRepository,
        eventRepository: EventRepository,
        whatsappService?: WhatsappService
    ) {
        this.ticketRepository = ticketRepository;
        this.clientRepository = clientRepository;
        this.phaseRepository = phaseRepository;
        this.eventRepository = eventRepository;
        this.whatsappService = whatsappService;
    }

    async execute(ticket: CreateTicketDTO): Promise<Ticket> {
        const now = new Date();
        const cleanPhone = String(ticket.cliente_telefono ?? "").trim();
        const cleanName = String(ticket.cliente_nombre ?? "").trim();

        if (!ticket.rp_id || !ticket.evento_id || !cleanName || !cleanPhone) {
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

        if (!event.codigo_evento) {
            const error = new Error("Event code is missing");
            (error as any).statusCode = 500;
            throw error;
        }

        let client = await this.clientRepository.getClientByPhone(cleanPhone);
        if (!client) {
            client = await this.clientRepository.createClient({
                nombre_completo: cleanName,
                telefono: cleanPhone
            });
        }

        const alreadyHasTicket = await this.ticketRepository.existsByClientAndEvent(client.id, ticket.evento_id);
        if (alreadyHasTicket) {
            const error = new Error("This client already has a ticket for the selected event");
            (error as any).statusCode = 409;
            throw error;
        }

        const phases = await this.phaseRepository.getPhasesByEventId(ticket.evento_id);
        const byMostRecentStart = (first: { fecha_inicio: Date; id: number }, second: { fecha_inicio: Date; id: number }) => {
            const startDiff = new Date(second.fecha_inicio).getTime() - new Date(first.fecha_inicio).getTime();
            if (startDiff !== 0) {
                return startDiff;
            }
            return second.id - first.id;
        };

        const phaseInCurrentDateRange = phases
            .filter((phase) => {
                const startsAt = new Date(phase.fecha_inicio);
                const endsAt = new Date(phase.fecha_fin);
                return now >= startsAt && now <= endsAt;
            })
            .sort(byMostRecentStart);

        const activePhaseInRange = phaseInCurrentDateRange.find((phase) => Boolean(phase.activa));
        const latestActivePhase = phases
            .filter((phase) => Boolean(phase.activa))
            .sort(byMostRecentStart)[0];
        const latestPhase = [...phases].sort(byMostRecentStart)[0];

        let selectedPhase = activePhaseInRange ?? phaseInCurrentDateRange[0] ?? latestActivePhase ?? latestPhase;

        const fallbackPrice = Number(event.precio_inicial) > 0
            ? Number(event.precio_inicial)
            : (Number(ticket.precio) > 0 ? Number(ticket.precio) : 0);

        if (!selectedPhase && fallbackPrice > 0) {
            const fallbackStart = new Date();
            const eventDate = new Date(event.fecha_evento);
            const fallbackEnd = eventDate > fallbackStart
                ? eventDate
                : new Date(fallbackStart.getTime() + 24 * 60 * 60 * 1000);

            selectedPhase = await this.phaseRepository.createPhase(ticket.evento_id, {
                nombre: "Fase automática",
                precio: fallbackPrice,
                fecha_inicio: fallbackStart,
                fecha_fin: fallbackEnd,
            });
        }

        if (!selectedPhase) {
            const error = new Error(
                `No phase found for selected event (id=${event.id}, nombre=${event.nombre}, codigo=${event.codigo_evento}). Create at least one phase with price.`
            );
            (error as any).statusCode = 400;
            throw error;
        }

        const price = Number(selectedPhase.precio);
        const commission = Number((price * 0.1).toFixed(2));
        const generatedCode = `${event.codigo_evento}-${randomBytes(6).toString("hex").toUpperCase()}`;
        const qrPayload = JSON.stringify({
            codigo: generatedCode,
            nombre: client.nombre_completo,
            telefono: client.telefono,
            rp_id: ticket.rp_id,
            codigo_evento: event.codigo_evento,
            estado: "ACTIVO"
        });

        const createdTicket = await this.ticketRepository.createTicket({
            codigo: generatedCode,
            cliente_nombre: cleanName,
            cliente_telefono: cleanPhone,
            cliente_id: client.id,
            rp_id: ticket.rp_id,
            evento_id: ticket.evento_id,
            fase_id: selectedPhase.id,
            precio: price,
            comision_rp: commission,
            qr_payload: qrPayload
        });

        this.whatsappService?.sendTicketQr({
            codigo: generatedCode,
            cliente_nombre: cleanName,
            cliente_telefono: cleanPhone,
            codigo_evento: event.codigo_evento,
        }).catch((err: unknown) => console.error("[WhatsApp] Error al enviar QR:", err));

        return createdTicket;
    }
}
