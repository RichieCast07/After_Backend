import type { UserResponseDTO } from "../../DataDTOs/UserResponseDTO.js";
import type { User } from "../user.js";

export function toUserResponseDTO(user: User): UserResponseDTO {
    return {
        id: user.id,
        nombre_completo: user.nombre_completo,
        telefono: user.telefono,
        rol_id: user.rol_id,
        comision_porcentaje: user.comision_porcentaje,
        activo: user.activo,
        fecha_creacion: user.fecha_creacion,
        username: user.username
    };
}

export function toUserResponseDTOArray(users: User[]): UserResponseDTO[] {
    return users.map(user => toUserResponseDTO(user));
}