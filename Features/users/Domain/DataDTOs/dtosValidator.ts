import type { LoginUserDTO } from './LoginUserDTO.js';
import type { RegisterUserDTO } from './RegisterUserDTO.js';
import type { UpdateUserDTO } from './UpdateUserDTO.js';

export class DTOValidators {
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

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

        if (!dto.email || !this.validateEmail(dto.email)) {
            errors.push('Invalid email format');
        }

        const passwordValidation = this.validatePassword(dto.password);
        if (!passwordValidation.valid) {
            errors.push(passwordValidation.message!);
        }

        if (!dto.username || !this.validateUsername(dto.username)) {
            errors.push('Username must be between 3 and 50 characters');
        }

        if (!dto.personaID || dto.personaID <= 0) {
            errors.push('Invalid personaID');
        }

        if (!dto.hotelID || dto.hotelID <= 0) {
            errors.push('Invalid hotelID');
        }

        const validRoles = ['admin', 'user', 'guest'];
        if (!dto.rol || !validRoles.includes(dto.rol)) {
            errors.push('Invalid role. Must be admin, user, or guest');
        }

        return errors;
    }

    static validateLoginDTO(dto: LoginUserDTO): string[] {
        const errors: string[] = [];

        if (!dto.email || !this.validateEmail(dto.email)) {
            errors.push('Invalid email format');
        }

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

        if (dto.email !== undefined && !this.validateEmail(dto.email)) {
            errors.push('Invalid email format');
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

        return errors;
    }

    static validateId(id: any): { valid: boolean; value?: number; message?: string } {
        const numId = Number(id);
        if (isNaN(numId) || numId <= 0) {
            return { valid: false, message: 'Invalid ID. Must be a positive number' };
        }
        return { valid: true, value: numId };
    }

    static validateEmail_Simple(email: any): { valid: boolean; message?: string } {
        if (!email || typeof email !== 'string') {
            return { valid: false, message: 'Email is required and must be a string' };
        }
        if (!this.validateEmail(email)) {
            return { valid: false, message: 'Invalid email format' };
        }
        return { valid: true };
    }
}