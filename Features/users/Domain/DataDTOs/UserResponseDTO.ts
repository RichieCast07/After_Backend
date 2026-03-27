export interface UserResponseDTO {
    id: number
    nombre_completo: string;
    telefono: number;
    username: string;
    rol_id: number;
    comision_porcentaje: number;
    activo: boolean;
    fecha_creacion: Date;
}
