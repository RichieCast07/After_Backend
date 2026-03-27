import type { Request, Response } from "express";
import type { GetClientsUseCase } from "../../Application/getClientsUseCase.js";

export class GetClientsHandler {
    private readonly getClientsUseCase: GetClientsUseCase;

    constructor(getClientsUseCase: GetClientsUseCase) {
        this.getClientsUseCase = getClientsUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const clients = await this.getClientsUseCase.execute();
            res.json(clients);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
