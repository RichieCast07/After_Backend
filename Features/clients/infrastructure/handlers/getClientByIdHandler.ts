import type { Request, Response } from "express";
import type { GetClientByIdUseCase } from "../../Application/getClientByIdUseCase.js";

export class GetClientByIdHandler {
    private readonly getClientByIdUseCase: GetClientByIdUseCase;

    constructor(getClientByIdUseCase: GetClientByIdUseCase) {
        this.getClientByIdUseCase = getClientByIdUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params as { id?: string };
            
            if (!id || typeof id !== 'string') {
                res.status(400).json({ error: "Client ID parameter required" });
                return;
            }
            
            const clientId = parseInt(id, 10);

            if (isNaN(clientId)) {
                res.status(400).json({ error: "Invalid client ID" });
                return;
            }

            const client = await this.getClientByIdUseCase.execute(clientId);

            if (!client) {
                res.status(404).json({ error: "Client not found" });
                return;
            }

            res.json(client);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
