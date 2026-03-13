export type TicketState = "ACTIVO" | "USADO";

export interface Ticket {
    id: number;
    codigo: string;
    cliente_id: number;
    cliente_nombre?: string;
    cliente_telefono?: string;
    rp_id: number;
    evento_id: number;
    codigo_evento?: string;
    fase_id: number;
    precio: number;
    comision_rp: number;
    estado: TicketState;
    qr_payload?: string;
    fecha_venta: Date;
    fecha_uso: Date | null;
}
