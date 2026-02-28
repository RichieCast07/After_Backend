import type { Request, Response } from "express";
import type { LoginUserUseCase } from "../../Application/authUseCases/loginUseCase.js";
import { DTOValidators } from "../../Domain/DataDTOs/dtosValidator.js";
import type { LoginUserDTO } from "../../Domain/DataDTOs/LoginUserDTO.js";
import type { LoginResponseDTO } from "../../Domain/DataDTOs/LoginResponseDTO.js";

/**
 * Handler para login de usuario con DTOs
 * 
 * Beneficios:
 * - Validación de credenciales antes del use case
 * - Respuesta estructurada con DTO específico
 * - Separación clara entre datos de entrada y salida
 * - Mejor documentación del contrato de la API
 */
export class LoginHandlerWithDTO {
    private readonly loginUseCase: LoginUserUseCase;

    constructor(loginUseCase: LoginUserUseCase) {
        this.loginUseCase = loginUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // 1. Extraer DTO del body
            const dto: LoginUserDTO = req.body;

            // 2. Validar DTO
            const validationErrors = DTOValidators.validateLoginDTO(dto);
            if (validationErrors.length > 0) {
                res.status(400).json({ 
                    success: false,
                    error: 'Validation failed',
                    details: validationErrors 
                });
                return;
            }

            // 3. Ejecutar caso de uso
            const { token, user } = await this.loginUseCase.execute(dto.username, dto.password);

            // 4. Construir respuesta usando LoginResponseDTO
            const response: LoginResponseDTO = {
                token,
                message: 'Login successful',
                user_id: user.id,
                rol_id: user.rol_id,
                username: user.username
            };

            // 5. Retornar respuesta
            res.status(200).json({
                success: true,
                ...response
            });
        } catch (error: any) {
            // Manejo especial para errores de autenticación
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ 
                success: false,
                error: error.message,
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            });
        }
    }
}
