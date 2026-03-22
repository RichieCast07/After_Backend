import type { Request, Response } from "express";
import type { DeleteTicketByCodeHandler } from "./handlers/deleteTicketByCodeHandler.js";
import type { GetExpiredActiveTicketsHandler } from "./handlers/getExpiredActiveTicketsHandler.js";
import type { GetPublicTicketByTokenHandler } from "./handlers/getPublicTicketByTokenHandler.js";
import type { GetTicketByCodeHandler } from "./handlers/getTicketByCodeHandler.js";
import type { GetTicketQrHandler } from "./handlers/getTicketQrHandler.js";
import type { GetTicketsByEventIdHandler } from "./handlers/getTicketsByEventIdHandler.js";
import type { GetTicketsByRpIdHandler } from "./handlers/getTicketsByRpIdHandler.js";
import type { MarkTicketAsUsedHandler } from "./handlers/markTicketAsUsedHandler.js";
import type { SellTicketHandler } from "./handlers/sellTicketHandler.js";

export class TicketController {
    private readonly sellTicketHandler: SellTicketHandler;
    private readonly getTicketByCodeHandler: GetTicketByCodeHandler;
    private readonly markTicketAsUsedHandler: MarkTicketAsUsedHandler;
    private readonly getTicketsByEventIdHandler: GetTicketsByEventIdHandler;
    private readonly getTicketsByRpIdHandler: GetTicketsByRpIdHandler;
    private readonly deleteTicketByCodeHandler: DeleteTicketByCodeHandler;
    private readonly getExpiredActiveTicketsHandler: GetExpiredActiveTicketsHandler;
    private readonly getTicketQrHandler: GetTicketQrHandler;
    private readonly getPublicTicketByTokenHandler: GetPublicTicketByTokenHandler;

    constructor(
        sellTicketHandler: SellTicketHandler,
        getTicketByCodeHandler: GetTicketByCodeHandler,
        markTicketAsUsedHandler: MarkTicketAsUsedHandler,
        getTicketsByEventIdHandler: GetTicketsByEventIdHandler,
        getTicketsByRpIdHandler: GetTicketsByRpIdHandler,
        deleteTicketByCodeHandler: DeleteTicketByCodeHandler,
        getExpiredActiveTicketsHandler: GetExpiredActiveTicketsHandler,
        getTicketQrHandler: GetTicketQrHandler,
        getPublicTicketByTokenHandler: GetPublicTicketByTokenHandler
    ) {
        this.sellTicketHandler = sellTicketHandler;
        this.getTicketByCodeHandler = getTicketByCodeHandler;
        this.markTicketAsUsedHandler = markTicketAsUsedHandler;
        this.getTicketsByEventIdHandler = getTicketsByEventIdHandler;
        this.getTicketsByRpIdHandler = getTicketsByRpIdHandler;
        this.deleteTicketByCodeHandler = deleteTicketByCodeHandler;
        this.getExpiredActiveTicketsHandler = getExpiredActiveTicketsHandler;
        this.getTicketQrHandler = getTicketQrHandler;
        this.getPublicTicketByTokenHandler = getPublicTicketByTokenHandler;
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

    deleteTicketByCode(req: Request, res: Response): Promise<void> {
        return this.deleteTicketByCodeHandler.handle(req, res);
    }

    getExpiredActiveTickets(req: Request, res: Response): Promise<void> {
        return this.getExpiredActiveTicketsHandler.handle(req, res);
    }

    getTicketQr(req: Request, res: Response): Promise<void> {
        return this.getTicketQrHandler.handle(req, res);
    }

    getPublicTicketByToken(req: Request, res: Response): Promise<void> {
        return this.getPublicTicketByTokenHandler.handle(req, res);
    }
}
