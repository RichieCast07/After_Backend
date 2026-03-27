import type { Request, Response } from "express";
import type { MetricsService } from "../../Application/metricsService.js";

export class GetEventRpMetricsHandler {
    private readonly metricsService: MetricsService;

    constructor(metricsService: MetricsService) {
        this.metricsService = metricsService;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const eventId = parseInt(req.params.eventId, 10);
            if (isNaN(eventId)) {
                res.status(400).json({ error: "Invalid event ID" });
                return;
            }

            const metrics = await this.metricsService.getEventRpMetrics(eventId);
            res.json(metrics);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
