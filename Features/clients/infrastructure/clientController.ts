import type { Request, Response } from "express";
import type { ClientRepository } from "../Domain/Repository/clientRepository.js";
import type { CreateClientHandler } from "./handlers/createClientHandler.js";
import type { GetClientByIdHandler } from "./handlers/getClientByIdHandler.js";
import type { GetClientsHandler } from "./handlers/getClientsHandler.js";
import type { SearchClientByPhoneHandler } from "./handlers/searchClientByPhoneHandler.js";

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
            const clients = await this.clientRepository.getClientsPortfolioForCsv();
            const formatDateForCsv = (dateValue: Date | string | null | undefined): string => {
                if (!dateValue) {
                    return "";
                }

                const parsedDate = new Date(dateValue);
                if (Number.isNaN(parsedDate.getTime())) {
                    return "";
                }

                return parsedDate.toLocaleString("es-MX", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });
            };

            const formatCurrencyForCsv = (amount: number | null | undefined): string => {
                if (amount == null || !Number.isFinite(Number(amount))) {
                    return "";
                }

                return Number(amount).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            };

            const headers = [
                "ID Cliente",
                "Nombre completo",
                "Teléfono",
                "Fecha de registro",
                "Código de boleto",
                "Tipo de boleto",
                "RP",
                "Evento",
                "Precio pagado",
                "Fecha de venta"
            ];

            const csvLines = [
                headers.join(","),
                ...clients.map((client) => {
                    const values = [
                        String(client.id),
                        String(client.nombre_completo ?? ""),
                        String(client.telefono ?? ""),
                        formatDateForCsv(client.fecha_registro),
                        String(client.codigo_boleto ?? ""),
                        String(client.tipo_boleto ?? ""),
                        String(client.rp_nombre ?? ""),
                        String(client.evento_nombre ?? ""),
                        formatCurrencyForCsv(client.precio_compra),
                        formatDateForCsv(client.fecha_venta)
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
