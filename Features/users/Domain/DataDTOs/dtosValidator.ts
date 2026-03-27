import type { LoginUserDTO } from './LoginUserDTO.js';
import type { RegisterUserDTO } from './RegisterUserDTO.js';
import type { UpdateUserDTO } from './UpdateUserDTO.js';

export class DTOValidators {
    static validatePassword(password: string): { valid: boolean; message?: string } {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters long' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one lowercase letter' };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        return { valid: true };
    }

    static validateUsername(username: string): boolean {
        return username.length >= 3 && username.length <= 50;
    }

    static validateRegisterDTO(dto: RegisterUserDTO): string[] {
        const errors: string[] = [];
        const telefonoNumber = Number((dto as any).telefono);

        const passwordValidation = this.validatePassword(dto.password);
        if (!passwordValidation.valid) {
            errors.push(passwordValidation.message!);
        }

        if (!dto.username || !this.validateUsername(dto.username)) {
            errors.push('Username must be between 3 and 50 characters');
        }

        if (!Number.isFinite(telefonoNumber)) {
            errors.push('Telefono is required and must be a number');
        }

        if (!dto.nombre_completo || typeof dto.nombre_completo !== 'string') {
            errors.push('Nombre completo is required and must be a string');
        }

        if(!dto.rol_id || typeof dto.rol_id !== 'number') {
            errors.push('Rol ID is required and must be a number');
        }

        if (telefonoNumber < 1000000000 || telefonoNumber > 9999999999) {
            errors.push('Telefono must be a valid 10-digit number');
        }

        const validRoles = [1, 2, 3];
        if (!dto.rol_id || !validRoles.includes(dto.rol_id)) {
            errors.push('Invalid role. Must be admin (1), RP (2), or Manager (3)');
        }

        if ((dto as any).comision_porcentaje !== undefined) {
            const commission = Number((dto as any).comision_porcentaje);
            if (!Number.isFinite(commission) || commission < 0 || commission > 100) {
                errors.push('Comision porcentaje must be a number between 0 and 100');
            }
        }

        return errors;
    }

    static validateLoginDTO(dto: LoginUserDTO): string[] {
        const errors: string[] = [];


        if (!dto.password || dto.password.length < 1) {
            errors.push('Password is required');
        }

        return errors;
    }

    static validateUpdateDTO(dto: UpdateUserDTO): string[] {
        const errors: string[] = [];

        if (dto.username !== undefined && !this.validateUsername(dto.username)) {
            errors.push('Username must be between 3 and 50 characters');
        }


        if (dto.password !== undefined) {
            const passwordValidation = this.validatePassword(dto.password);
            if (!passwordValidation.valid) {
                errors.push(passwordValidation.message!);
            }
        }

        const validRoles = ['admin', 'user', 'guest'];
        if (dto.rol !== undefined && !validRoles.includes(dto.rol)) {
            errors.push('Invalid role. Must be admin, user, or guest');
        }

        if (dto.comision_porcentaje !== undefined) {
            const commission = Number(dto.comision_porcentaje);
            if (!Number.isFinite(commission) || commission < 0 || commission > 100) {
                errors.push('Comision porcentaje must be a number between 0 and 100');
            }
        }

        return errors;
    }

    static validateId(id: any): { valid: boolean; value?: number; message?: string } {
        const numId = Number(id);
        if (isNaN(numId) || numId <= 0) {
            return { valid: false, message: 'Invalid ID. Must be a positive number' };
        }
        return { valid: true, value: numId };
    }

}