import type { Request, Response } from "express";
import type { GetClientsHandler } from "./handlers/getClientsHandler.js";
import type { GetClientByIdHandler } from "./handlers/getClientByIdHandler.js";
import type { SearchClientByPhoneHandler } from "./handlers/searchClientByPhoneHandler.js";
import type { CreateClientHandler } from "./handlers/createClientHandler.js";
import type { ClientRepository } from "../Domain/Repository/clientRepository.js";

export class ClientController {
    private readonly getClientsHandler: GetClientsHandler;
    private readonly getClientByIdHandler: GetClientByIdHandler;
    private readonly searchClientByPhoneHandler: SearchClientByPhoneHandler;
    private readonly createClientHandler: CreateClientHandler;
    private readonly clientRepository: ClientRepository;

    constructor(
        getClientsHandler: GetClientsHandler,
        getClientByIdHandler: GetClientByIdHandler,
        searchClientByPhoneHandler: SearchClientByPhoneHandler,
        createClientHandler: CreateClientHandler,
        clientRepository: ClientRepository
    ) {
        this.getClientsHandler = getClientsHandler;
        this.getClientByIdHandler = getClientByIdHandler;
        this.searchClientByPhoneHandler = searchClientByPhoneHandler;
        this.createClientHandler = createClientHandler;
        this.clientRepository = clientRepository;
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

    async downloadClientsCsv(req: Request, res: Response): Promise<void> {
        try {
            const clients = await this.clientRepository.getClients();
            const headers = ["id", "nombre_completo", "telefono", "fecha_registro"];

            const csvLines = [
                headers.join(","),
                ...clients.map((client) => {
                    const values = [
                        String(client.id),
                        String(client.nombre_completo ?? ""),
                        String(client.telefono ?? ""),
                        client.fecha_registro ? new Date(client.fecha_registro).toISOString() : ""
                    ];

                    return values
                        .map((value) => `"${value.replace(/"/g, '""')}"`)
                        .join(",");
                })
            ];

            const fileName = `clientes_${new Date().toISOString().slice(0, 10)}.csv`;
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
            res.status(200).send(csvLines.join("\n"));
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message || "Failed to generate CSV" });
        }
    }

    async deleteClient(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, error: "Invalid ID" });
                return;
            }
            await this.clientRepository.deleteClient(id);
            res.status(200).json({ success: true, message: `Client ${id} deleted successfully` });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
}
