export interface Client {
    id: number;
    nombre_completo: string;
    telefono: string;
    fecha_registro: Date;
    codigo_boleto?: string | null;
    tipo_boleto?: string | null;
    rp_nombre?: string | null;
    evento_nombre?: string | null;
    precio_compra?: number | null;
    fecha_venta?: Date | null;
}
