import type { User } from "../Data/user.js";

export interface RegisterUserDTO {
    username: string;
    telefono: number;
    rol_id: number;
    password: string;
    nombre_completo: string;
}
export function fromRegisterDTOToUser(dto: RegisterUserDTO): User {
    return {
        username: dto.username,
        telefono: dto.telefono,
        rol_id: dto.rol_id,
        activo: true,
        fecha_creacion: new Date(),
        password_hash: dto.password,
        id: 0, // This will be set by the database when the user is created
        nombre_completo: dto.nombre_completo
    };
}