export interface UpdateUserDTO {
    username?: string;
    password?: string;
    email?: string;
    rol?: 'admin' | 'user' | 'guest';
    activo?: boolean;
    comision_porcentaje?: number;
}