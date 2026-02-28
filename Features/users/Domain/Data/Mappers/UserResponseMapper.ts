import type { UserResponseDTO } from "../../DataDTOs/UserResponseDTO.js";
import type { User } from "../user.js";

export function toUserResponseDTO(user: User): UserResponseDTO {
    return {
        userID: user.userID,
        personaID: user.personaID,
        hotelID: user.hotelID,
        email: user.email,
        username: user.username,
        rol: user.rol,
        activo: user.activo,
        fechaRegistro: user.fechaRegistro
    };
}

export function toUserResponseDTOArray(users: User[]): UserResponseDTO[] {
    return users.map(user => toUserResponseDTO(user));
}