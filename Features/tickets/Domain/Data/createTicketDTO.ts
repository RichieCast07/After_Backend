export interface CreateTicketDTO {
    codigo?: string;
    cliente_nombre: string;
    cliente_telefono: string;
    rp_id: number;
    evento_id: number;
    tipo_boleto?: string;
    cliente_id?: number;
    fase_id?: number;
    precio?: number;
    comision_rp?: number;
    qr_payload?: string;
}
