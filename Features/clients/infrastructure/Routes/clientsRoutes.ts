import { Router } from "express";
import type { ClientController } from "../clientController.js";

export function createClientsRoutes(clientController: ClientController): Router {
    const router = Router();

    router.get("/", (req, res) => clientController.getClients(req, res));
    router.get("/search", (req, res) => clientController.searchClientByPhone(req, res));
    router.get("/search/:telefono", (req, res) => clientController.searchClientByPhone(req, res));
    router.get("/search-phone", (req, res) => clientController.searchClientByPhone(req, res));
    router.get("/by-phone", (req, res) => clientController.searchClientByPhone(req, res));
    router.get("/export/csv", (req, res) => clientController.downloadClientsCsv(req, res));
    router.post("/", (req, res) => clientController.createClient(req, res));
    router.delete("/:id", (req, res) => clientController.deleteClient(req, res));
    router.get("/:id", (req, res) => clientController.getClientById(req, res));

    return router;
}
