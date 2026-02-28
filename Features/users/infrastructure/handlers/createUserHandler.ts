import type { Request, Response } from "express";
import type { CreateUserUseCase } from "../../Application/userUseCases/createUserUseCase.js";

export class CreateUserHandler {
    private readonly createUserUseCase: CreateUserUseCase;

    constructor(createUserUseCase: CreateUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;
            const newUser = await this.createUserUseCase.execute(userData);
            res.status(201).json(newUser);
        } catch (error: any) {
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
