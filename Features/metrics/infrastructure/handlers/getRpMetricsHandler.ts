import type { Request, Response } from "express";
import type { MetricsService } from "../../Application/metricsService.js";

export class GetRpMetricsHandler {
    private readonly metricsService: MetricsService;

    constructor(metricsService: MetricsService) {
        this.metricsService = metricsService;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const metrics = await this.metricsService.getRpMetrics();
            res.json(metrics);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
