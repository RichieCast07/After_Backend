import type { Request, Response } from "express";
import type { RegisterUserUseCase } from "../../Application/authUseCases/registerUserUseCase.js";
import {
    DTOValidators,
} from "../../Domain/DataDTOs/dtosValidator.js";
import { fromRegisterDTOToUser, type RegisterUserDTO } from "../../Domain/DataDTOs/RegisterUserDTO.js";
import { toUserResponseDTO } from "../../Domain/Data/Mappers/UserResponseMapper.js";

/**
 * Handler para registro de usuario con DTOs
 * 
 * Beneficios:
 * - Validación explícita antes de llegar al use case
 * - Respuestas sin datos sensibles (sin password)
 * - Mejor documentación del contrato de la API
 * - Separación clara entre capa de presentación y dominio
 */
export class RegisterHandlerWithDTO {
    private readonly registerUserUseCase: RegisterUserUseCase;

    constructor(registerUserUseCase: RegisterUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // 1. Extraer DTO del body
            const dto: RegisterUserDTO = req.body;

            // 2. Validar el DTO
            const validationErrors = DTOValidators.validateRegisterDTO(dto);
            if (validationErrors.length > 0) {
                res.status(400).json({ 
                    success: false,
                    error: 'Validation failed',
                    details: validationErrors 
                });
                return;
            }

            // 3. Convertir DTO a entidad de dominio
            const userToRegister = fromRegisterDTOToUser(dto);

            // 4. Ejecutar caso de uso
            const newUser = await this.registerUserUseCase.execute(userToRegister);

            // 5. Convertir respuesta a DTO (sin password)
            const response = toUserResponseDTO(newUser);

            // 6. Retornar respuesta
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: response
            });
        } catch (error: any) {
            // Manejo de errores centralizado
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ 
                success: false,
                error: error.message,
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            });
        }
    }
}
