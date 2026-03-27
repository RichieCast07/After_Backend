import type { User } from "../Data/user.js";

export interface RegisterUserDTO {
    username: string;
    telefono: number;
    rol_id: number;
    password: string;
    nombre_completo: string;
    comision_porcentaje?: number;
}
export function fromRegisterDTOToUser(dto: RegisterUserDTO): User {
    return {
        username: dto.username,
        telefono: dto.telefono,
        rol_id: dto.rol_id,
        comision_porcentaje: Number(dto.comision_porcentaje ?? 10),
        activo: true,
        fecha_creacion: new Date(),
        password_hash: dto.password,
        id: 0, // This will be set by the database when the user is created
        nombre_completo: dto.nombre_completo
    };
}