export interface TicketType {
    id: number;
    evento_id: number;
    nombre: string;
    activo: boolean;
    fecha_creacion: Date;
}

export interface PhaseTicketTypePrice {
    ticket_type_id: number;
    nombre: string;
    activo: boolean;
    precio: number;
}