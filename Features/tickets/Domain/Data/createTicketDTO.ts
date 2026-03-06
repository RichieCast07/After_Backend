export interface CreateTicketDTO {
    codigo: string;
    cliente_id: number;
    rp_id: number;
    evento_id: number;
    fase_id: number;
    precio: number;
    comision_rp: number;
}
