import type { Request, Response } from "express";
import type { CreateClientUseCase } from "../../Application/createClientUseCase.js";
import type { CreateClientDTO } from "../../Domain/Data/createClientDTO.js";

export class CreateClientHandler {
    private readonly createClientUseCase: CreateClientUseCase;

    constructor(createClientUseCase: CreateClientUseCase) {
        this.createClientUseCase = createClientUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { nombre_completo, telefono } = req.body as CreateClientDTO;

            if (!nombre_completo || !telefono) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }

            const client = await this.createClientUseCase.execute({
                nombre_completo,
                telefono
            });

            res.status(201).json(client);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
