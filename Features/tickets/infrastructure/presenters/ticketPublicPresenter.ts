import type { Ticket } from "../../Domain/Data/ticket.js";

export type PublicTicket = Ticket & {
    public_url: string;
};

export function withPublicTicketUrl(ticket: Ticket): PublicTicket {
    return {
        ...ticket,
        public_url: `/ticket/${encodeURIComponent(ticket.codigo)}`
    };
}

export function withPublicTicketUrls(tickets: Ticket[]): PublicTicket[] {
    return tickets.map(withPublicTicketUrl);
}