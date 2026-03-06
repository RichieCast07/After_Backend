import type { Request, Response } from "express";
import type { SellTicketHandler } from "./handlers/sellTicketHandler.js";
import type { GetTicketByCodeHandler } from "./handlers/getTicketByCodeHandler.js";
import type { MarkTicketAsUsedHandler } from "./handlers/markTicketAsUsedHandler.js";
import type { GetTicketsByEventIdHandler } from "./handlers/getTicketsByEventIdHandler.js";
import type { GetTicketsByRpIdHandler } from "./handlers/getTicketsByRpIdHandler.js";

export class TicketController {
    private readonly sellTicketHandler: SellTicketHandler;
    private readonly getTicketByCodeHandler: GetTicketByCodeHandler;
    private readonly markTicketAsUsedHandler: MarkTicketAsUsedHandler;
    private readonly getTicketsByEventIdHandler: GetTicketsByEventIdHandler;
    private readonly getTicketsByRpIdHandler: GetTicketsByRpIdHandler;

    constructor(
        sellTicketHandler: SellTicketHandler,
        getTicketByCodeHandler: GetTicketByCodeHandler,
        markTicketAsUsedHandler: MarkTicketAsUsedHandler,
        getTicketsByEventIdHandler: GetTicketsByEventIdHandler,
        getTicketsByRpIdHandler: GetTicketsByRpIdHandler
    ) {
        this.sellTicketHandler = sellTicketHandler;
        this.getTicketByCodeHandler = getTicketByCodeHandler;
        this.markTicketAsUsedHandler = markTicketAsUsedHandler;
        this.getTicketsByEventIdHandler = getTicketsByEventIdHandler;
        this.getTicketsByRpIdHandler = getTicketsByRpIdHandler;
    }

    sellTicket(req: Request, res: Response): Promise<void> {
        return this.sellTicketHandler.handle(req, res);
    }

    getTicketByCode(req: Request, res: Response): Promise<void> {
        return this.getTicketByCodeHandler.handle(req, res);
    }

    markTicketAsUsed(req: Request, res: Response): Promise<void> {
        return this.markTicketAsUsedHandler.handle(req, res);
    }

    getTicketsByEventId(req: Request, res: Response): Promise<void> {
        return this.getTicketsByEventIdHandler.handle(req, res);
    }

    getTicketsByRpId(req: Request, res: Response): Promise<void> {
        return this.getTicketsByRpIdHandler.handle(req, res);
    }
}
