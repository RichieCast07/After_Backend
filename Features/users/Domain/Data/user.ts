export interface User {
    id: number;
    nombre_completo: string;
    password_hash: string;
    username: string;
    telefono: number;
    rol_id: number;
    comision_porcentaje: number;
    activo: boolean;
    fecha_creacion: Date;
}
