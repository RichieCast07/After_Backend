import type { Request, Response } from "express";
import type { GetUsersByIdUseCase } from "../../Application/userUseCases/getUserByIDUseCase.js";
import { DTOValidators } from "../../Domain/DataDTOs/dtosValidator.js";
import { toUserResponseDTO } from "../../Domain/Data/Mappers/UserResponseMapper.js";

/**
 * Handler para obtener usuario por ID con DTOs
 * 
 * Beneficios:
 * - Validación del ID antes de llegar al use case
 * - Respuesta sin password
 * - Manejo de errores consistente
 */
export class GetUserByIDHandlerWithDTO {
    private readonly getUsersByIdUseCase: GetUsersByIdUseCase;

    constructor(getUsersByIdUseCase: GetUsersByIdUseCase) {
        this.getUsersByIdUseCase = getUsersByIdUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // 1. Validar ID del parámetro
            const idValidation = DTOValidators.validateId(req.params.id);
            if (!idValidation.valid) {
                res.status(400).json({ 
                    success: false,
                    error: idValidation.message 
                });
                return;
            }

            // 2. Ejecutar caso de uso
            const user = await this.getUsersByIdUseCase.execute(idValidation.value!);
            
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
