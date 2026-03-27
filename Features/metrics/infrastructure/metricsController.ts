import type { Request, Response } from "express";
import type { GetOverallMetricsHandler } from "./handlers/getOverallMetricsHandler.js";
import type { GetRpMetricsHandler } from "./handlers/getRpMetricsHandler.js";
import type { GetEventMetricsHandler } from "./handlers/getEventMetricsHandler.js";
import type { GetEventPhaseMetricsHandler } from "./handlers/getEventPhaseMetricsHandler.js";
import type { GetEventRpMetricsHandler } from "./handlers/getEventRpMetricsHandler.js";

export class MetricsController {
    private readonly getOverallMetricsHandler: GetOverallMetricsHandler;
    private readonly getRpMetricsHandler: GetRpMetricsHandler;
    private readonly getEventMetricsHandler: GetEventMetricsHandler;
    private readonly getEventPhaseMetricsHandler: GetEventPhaseMetricsHandler;
    private readonly getEventRpMetricsHandler: GetEventRpMetricsHandler;

    constructor(
        getOverallMetricsHandler: GetOverallMetricsHandler,
        getRpMetricsHandler: GetRpMetricsHandler,
        getEventMetricsHandler: GetEventMetricsHandler,
        getEventPhaseMetricsHandler: GetEventPhaseMetricsHandler,
        getEventRpMetricsHandler: GetEventRpMetricsHandler
    ) {
        this.getOverallMetricsHandler = getOverallMetricsHandler;
        this.getRpMetricsHandler = getRpMetricsHandler;
        this.getEventMetricsHandler = getEventMetricsHandler;
        this.getEventPhaseMetricsHandler = getEventPhaseMetricsHandler;
        this.getEventRpMetricsHandler = getEventRpMetricsHandler;
    }

    getOverallMetrics(req: Request, res: Response): Promise<void> {
        return this.getOverallMetricsHandler.handle(req, res);
    }

    getRpMetrics(req: Request, res: Response): Promise<void> {
        return this.getRpMetricsHandler.handle(req, res);
    }

    getEventMetrics(req: Request, res: Response): Promise<void> {
        return this.getEventMetricsHandler.handle(req, res);
    }

    getEventPhaseMetrics(req: Request, res: Response): Promise<void> {
        return this.getEventPhaseMetricsHandler.handle(req, res);
    }

    getEventRpMetrics(req: Request, res: Response): Promise<void> {
        return this.getEventRpMetricsHandler.handle(req, res);
    }
}
