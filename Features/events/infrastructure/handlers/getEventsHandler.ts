import type { Request, Response } from "express";
import type { GetEventsUseCase } from "../../Application/getEventsUseCase.js";

export class GetEventsHandler {
    private readonly getEventsUseCase: GetEventsUseCase;

    constructor(getEventsUseCase: GetEventsUseCase) {
        this.getEventsUseCase = getEventsUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const events = await this.getEventsUseCase.execute();
            res.json(events);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
