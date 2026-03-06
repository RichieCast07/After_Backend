import type { Client } from "../../Domain/Data/client.js";
import type { CreateClientDTO } from "../../Domain/Data/createClientDTO.js";
import { ClientRepository } from "../../Domain/Repository/clientRepository.js";
import db from "../../../../Core/db.js";

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
}
