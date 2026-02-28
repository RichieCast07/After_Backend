import type { Request, Response } from "express";
import type { PutUsersUseCase } from "../../Application/userUseCases/putUserUseCase.js";
import { DTOValidators} from "../../Domain/DataDTOs/dtosValidator.js";
import type { UpdateUserDTO } from "../../Domain/DataDTOs/UpdateUserDTO.js";
import { toUserResponseDTO } from "../../Domain/Data/Mappers/UserResponseMapper.js";

/**
 * Handler para actualizar usuario con DTOs
 * 
 * Beneficios:
 * - Validación completa del ID y datos
 * - Solo se permiten campos específicos en la actualización
 * - Respuesta sin password
 * - Previene inyección de campos no autorizados
 */
export class PutUserHandlerWithDTO {
    private readonly putUserUseCase: PutUsersUseCase;

    constructor(putUserUseCase: PutUsersUseCase) {
        this.putUserUseCase = putUserUseCase;
    }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            // 1. Validar ID del parámetro
            const idValidation = DTOValidators.validateId(request.params.id);
            if (!idValidation.valid) {
                response.status(400).json({ 
                    success: false,
                    error: idValidation.message 
                });
                return;
            }

            // 2. Extraer y validar DTO del body
            const dto: UpdateUserDTO = request.body;
            
            // 3. Validar campos del DTO
            const validationErrors = DTOValidators.validateUpdateDTO(dto);
            if (validationErrors.length > 0) {
                response.status(400).json({ 
                    success: false,
                    error: 'Validation failed',
                    details: validationErrors 
                });
                return;
            }

            // 4. Verificar que al menos hay algo para actualizar
            if (Object.keys(dto).length === 0) {
                response.status(400).json({ 
                    success: false,
                    error: 'No fields provided for update' 
                });
                return;
            }

            // 5. Ejecutar caso de uso
            const updatedUser = await this.putUserUseCase.execute(idValidation.value!, dto);
            
            // 6. Convertir a DTO (sin password)
            const responseDTO = toUserResponseDTO(updatedUser);
            
            // 7. Retornar respuesta
            response.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: responseDTO
            });
        } catch (error: any) {
            response.status(error.statusCode || 500).json({ 
                success: false,
                error: error.message,
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            });
        }
    }
}
