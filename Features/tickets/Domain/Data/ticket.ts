export type TicketState = "ACTIVO" | "USADO";

export interface Ticket {
    id: number;
    codigo: string;
    cliente_id: number;
    rp_id: number;
    evento_id: number;
    fase_id: number;
    precio: number;
    comision_rp: number;
    estado: TicketState;
    fecha_venta: Date;
    fecha_uso: Date | null;
}
