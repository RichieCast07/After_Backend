import type { Request, Response } from "express";
import type { GetClientsHandler } from "./handlers/getClientsHandler.js";
import type { GetClientByIdHandler } from "./handlers/getClientByIdHandler.js";
import type { SearchClientByPhoneHandler } from "./handlers/searchClientByPhoneHandler.js";
import type { CreateClientHandler } from "./handlers/createClientHandler.js";

export class ClientController {
    private readonly getClientsHandler: GetClientsHandler;
    private readonly getClientByIdHandler: GetClientByIdHandler;
    private readonly searchClientByPhoneHandler: SearchClientByPhoneHandler;
    private readonly createClientHandler: CreateClientHandler;

    constructor(
        getClientsHandler: GetClientsHandler,
        getClientByIdHandler: GetClientByIdHandler,
        searchClientByPhoneHandler: SearchClientByPhoneHandler,
        createClientHandler: CreateClientHandler
    ) {
        this.getClientsHandler = getClientsHandler;
        this.getClientByIdHandler = getClientByIdHandler;
        this.searchClientByPhoneHandler = searchClientByPhoneHandler;
        this.createClientHandler = createClientHandler;
    }

    getClients(req: Request, res: Response): Promise<void> {
        return this.getClientsHandler.handle(req, res);
    }

    getClientById(req: Request, res: Response): Promise<void> {
        return this.getClientByIdHandler.handle(req, res);
    }

    searchClientByPhone(req: Request, res: Response): Promise<void> {
        return this.searchClientByPhoneHandler.handle(req, res);
    }

    createClient(req: Request, res: Response): Promise<void> {
        return this.createClientHandler.handle(req, res);
    }
}
