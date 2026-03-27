import type { Request, Response } from "express";
import type { GetClientByPhoneUseCase } from "../../Application/getClientByPhoneUseCase.js";

export class SearchClientByPhoneHandler {
    private readonly getClientByPhoneUseCase: GetClientByPhoneUseCase;

    constructor(getClientByPhoneUseCase: GetClientByPhoneUseCase) {
        this.getClientByPhoneUseCase = getClientByPhoneUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const telefonoFromQuery = req.query.telefono ?? req.query.phone ?? req.query.clientPhone;
            const telefonoFromParams = req.params.telefono ?? req.params.phone;
            const telefono = telefonoFromQuery ?? telefonoFromParams;

            if (!telefono || typeof telefono !== "string") {
                res.status(400).json({ error: "Phone parameter required" });
                return;
            }

            const client = await this.getClientByPhoneUseCase.execute(telefono);

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
