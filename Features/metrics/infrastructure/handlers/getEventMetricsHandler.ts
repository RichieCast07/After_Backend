import type { Request, Response } from "express";
import type { MetricsService } from "../../Application/metricsService.js";

export class GetEventMetricsHandler {
    private readonly metricsService: MetricsService;

    constructor(metricsService: MetricsService) {
        this.metricsService = metricsService;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { eventId } = req.params as { eventId?: string };
            
            if (!eventId || typeof eventId !== 'string') {
                res.status(400).json({ error: "Event ID parameter required" });
                return;
            }
            
            const id = parseInt(eventId, 10);

            if (isNaN(id)) {
                res.status(400).json({ error: "Invalid event ID" });
                return;
            }

            const metrics = await this.metricsService.getEventMetrics(id);
            res.json(metrics);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
