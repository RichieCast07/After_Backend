export interface Event {
    id: number;
    nombre: string;
    codigo_evento: string;
    precio_inicial?: number;
    fecha_evento: Date;
    lugar: string;
    maps_url?: string | null;
    activo: boolean;
    fecha_creacion: Date;
}
