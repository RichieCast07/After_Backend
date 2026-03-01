import type { Request, Response } from "express";
import type { GetUsersByIdUseCase } from "../../Application/userUseCases/getUserByIDUseCase.js";
import { DTOValidators } from "../../Domain/DataDTOs/dtosValidator.js";
import { toUserResponseDTO } from "../../Domain/Data/Mappers/UserResponseMapper.js";
import type { GetUsersByRolUseCase } from "../../Application/userUseCases/getUsesByRol.js";

/**
 * Handler para obtener usuario por ID con DTOs
 * 
 * Beneficios:
 * - Validación del ID antes de llegar al use case
 * - Respuesta sin password
 * - Manejo de errores consistente
 */
export class GetUserByRolHandlerWithDTO {
    private readonly getUsersByRolUseCase: GetUsersByRolUseCase;

    constructor(getUsersByRolUseCase: GetUsersByRolUseCase) {
        this.getUsersByRolUseCase = getUsersByRolUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // 1. Validar ID del parámetro
            const idValidation = DTOValidators.validateId(req.params.rolid);
            if (!idValidation.valid) {
                res.status(400).json({ 
                    success: false,
                    error: idValidation.message 
                });
                return;
            }

            // 2. Ejecutar caso de uso
            const user = await this.getUsersByRolUseCase.execute(idValidation.value!);
            
            // 3. Convertir a DTO (sin password)
            const response = user.map(u => toUserResponseDTO(u));
            
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
