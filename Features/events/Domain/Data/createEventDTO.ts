export interface CreateEventDTO {
    nombre: string;
    fecha_evento: Date;
    lugar: string;
    maps_url?: string;
    precio_inicial: number;
}
