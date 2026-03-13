export interface Event {
    id: number;
    nombre: string;
    codigo_evento: string;
    precio_inicial?: number;
    fecha_evento: Date;
    lugar: string;
    activo: boolean;
    fecha_creacion: Date;
}
