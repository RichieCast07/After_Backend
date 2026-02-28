import type { User } from "../Data/user.js";

export interface RegisterUserDTO {
    email: string;
    password: string;
    username: string;
    personaID: number;
    hotelID: number;
    rol: 'admin' | 'user' | 'guest'; // Tipos literales para roles válidos
}
export function fromRegisterDTOToUser(dto: RegisterUserDTO): User {
    return {
        userID: 0, // Se asignará en la BD
        personaID: dto.personaID,
        hotelID: dto.hotelID,
        email: dto.email,
        password: dto.password,
        username: dto.username,
        rol: dto.rol,
        activo: true,
        fechaRegistro: new Date()
    };
}