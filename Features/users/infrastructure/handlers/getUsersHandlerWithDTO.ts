import type { Request, Response } from "express";
import type { GetUsersUseCase } from "../../Application/userUseCases/getUsersUseCase.js";
import { toUserResponseDTOArray } from "../../Domain/Data/Mappers/UserResponseMapper.js";
import { } from "../../Domain/DataDTOs/dtosValidator.js";

export class GetUsersHandlerWithDTO {
    private readonly getUsersUseCase: GetUsersUseCase;

    constructor(getUsersUseCase: GetUsersUseCase) {
        this.getUsersUseCase = getUsersUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // 1. Ejecutar caso de uso
            const users = await this.getUsersUseCase.execute();
            
            // 2. Convertir a DTOs (sin passwords)
            const response = toUserResponseDTOArray(users);
            
            // 3. Retornar respuesta
            res.status(200).json({
                success: true,
                count: response.length,
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
