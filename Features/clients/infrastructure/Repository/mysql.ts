import db from "../../../../Core/db.js";
import type { Client } from "../../Domain/Data/client.js";
import type { CreateClientDTO } from "../../Domain/Data/createClientDTO.js";
import { ClientRepository } from "../../Domain/Repository/clientRepository.js";

export class MySQLClientRepository extends ClientRepository {
    async getClients(): Promise<Client[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                "SELECT id, nombre_completo, telefono, fecha_registro FROM clientes"
            );
            return rows as Client[];
        } finally {
            connection.release();
        }
    }

    async getClientsPortfolioForCsv(): Promise<Client[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT c.id, c.nombre_completo, c.telefono, c.fecha_registro,
                        b.codigo AS codigo_boleto,
                        b.tipo_boleto,
                        u.nombre_completo AS rp_nombre,
                        e.nombre AS evento_nombre,
                        b.precio AS precio_compra,
                        b.fecha_venta
                 FROM clientes c
                 LEFT JOIN boletos b ON b.cliente_id = c.id
                 LEFT JOIN usuarios u ON u.id = b.rp_id
                 LEFT JOIN eventos e ON e.id = b.evento_id
                 ORDER BY c.id ASC, b.fecha_venta DESC`
            );
            return rows as Client[];
        } finally {
            connection.release();
        }
    }

    async getClientById(clientId: number): Promise<Client | null> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                "SELECT id, nombre_completo, telefono, fecha_registro FROM clientes WHERE id = ?",
                [clientId]
            );
            const clients = rows as Client[];
            return clients.length > 0 ? (clients[0] as Client) : null;
        } finally {
            connection.release();
        }
    }

    async getClientByPhone(phone: string): Promise<Client | null> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                "SELECT id, nombre_completo, telefono, fecha_registro FROM clientes WHERE telefono = ?",
                [phone]
            );
            const clients = rows as Client[];
            return clients.length > 0 ? (clients[0] as Client) : null;
        } finally {
            connection.release();
        }
    }

    async createClient(client: CreateClientDTO): Promise<Client> {
        const connection = await db.pool.getConnection();
        try {
            const [result] = await connection.query(
                "INSERT INTO clientes (nombre_completo, telefono) VALUES (?, ?)",
                [client.nombre_completo, client.telefono]
            );
            const insertId = (result as any).insertId;
            const created = await this.getClientById(insertId);
            if (!created) throw new Error("Failed to retrieve created client");
            return created;
        } finally {
            connection.release();
        }
    }

    async deleteClient(clientId: number): Promise<void> {
        const connection = await db.pool.getConnection();
        try {
            const existing = await this.getClientById(clientId);
            if (!existing) throw new Error("Client not found");

            await connection.query("DELETE FROM clientes WHERE id = ?", [clientId]);
        } finally {
            connection.release();
        }
    }
}
