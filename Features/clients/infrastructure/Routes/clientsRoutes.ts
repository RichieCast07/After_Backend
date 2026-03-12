import { Router } from "express";
import type { ClientController } from "../clientController.js";

export function createClientsRoutes(clientController: ClientController): Router {
    const router = Router();

    router.get("/", (req, res) => clientController.getClients(req, res));
    router.get("/search", (req, res) => clientController.searchClientByPhone(req, res));
    router.post("/", (req, res) => clientController.createClient(req, res));
    router.delete("/:id", (req, res) => clientController.deleteClient(req, res));
    router.get("/:id", (req, res) => clientController.getClientById(req, res));

    return router;
}
