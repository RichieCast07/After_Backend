import type { Request, Response } from "express";
import type { GetUserByEmailUseCase } from "../../Application/userUseCases/getUserByEmailUseCase.js";
import { DTOValidators } from "../../Domain/DataDTOs/dtosValidator.js";
import { toUserResponseDTO } from "../../Domain/Data/Mappers/UserResponseMapper.js";

/**
 * Handler para obtener usuario por email con DTOs
 * 
 * Beneficios:
 * - Validación del email antes de llegar al use case
 * - Respuesta sin password
 * - Manejo de errores consistente
 */
export class GetUserByEmailHandlerWithDTO {
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase;

    constructor(getUserByEmailUseCase: GetUserByEmailUseCase) {
        this.getUserByEmailUseCase = getUserByEmailUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const email = req.params.email;
            
            // 1. Validar email del parámetro
            const emailValidation = DTOValidators.validateEmail_Simple(email);
            if (!emailValidation.valid) {
                res.status(400).json({ 
                    success: false,
                    error: emailValidation.message 
                });
                return;
            }

            // 2. Ejecutar caso de uso
            const user = await this.getUserByEmailUseCase.execute(email as string);
            
            // 3. Convertir a DTO (sin password)
            const response = toUserResponseDTO(user);
            
            // 4. Retornar respuesta
            res.status(200).json({
                success: true,
                data: response
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ 
                success: false,
                error: error.message,
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            });
        }
    }
}
