import type { Request, Response } from "express";
import type { GetExpiredActiveTicketsUseCase } from "../../Application/getExpiredActiveTicketsUseCase.js";

export class GetExpiredActiveTicketsHandler {
    private readonly getExpiredActiveTicketsUseCase: GetExpiredActiveTicketsUseCase;

    constructor(getExpiredActiveTicketsUseCase: GetExpiredActiveTicketsUseCase) {
        this.getExpiredActiveTicketsUseCase = getExpiredActiveTicketsUseCase;
    }

    async handle(_req: Request, res: Response): Promise<void> {
        try {
            const tickets = await this.getExpiredActiveTicketsUseCase.execute();
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
