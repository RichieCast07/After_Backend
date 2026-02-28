import type { Request, Response } from "express";
import type { DeleteUserUseCase } from "../../Application/userUseCases/deleteUserUseCase.js";
import { DTOValidators } from "../../Domain/DataDTOs/dtosValidator.js";

/**
 * Handler para eliminar usuario con DTOs
 * 
 * Beneficios:
 * - Validación del ID antes de llegar al use case
 * - Respuesta estructurada consistente
 * - Mejor manejo de errores
 */
export class DeleteUserHandlerWithDTO {
    private readonly deleteUserUseCase: DeleteUserUseCase;

    constructor(deleteUserUseCase: DeleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase;
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
            await this.deleteUserUseCase.execute(idValidation.value!);
            
            // 3. Retornar respuesta de éxito
            res.status(200).json({
                success: true,
                message: `User with ID ${idValidation.value} deleted successfully`
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
