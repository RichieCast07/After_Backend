import db from "../../../../Core/db.js";
import type { PhaseTicketTypePrice, TicketType } from "../../Domain/Data/ticketType.js";
import { TicketTypeRepository } from "../../Domain/Repository/ticketTypeRepository.js";

export class MySQLTicketTypeRepository extends TicketTypeRepository {
    private normalizeName(name: string): string {
        return String(name ?? "").trim().toUpperCase();
    }

    async getTicketTypesByEventId(eventId: number): Promise<TicketType[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, evento_id, nombre, activo, fecha_creacion
                 FROM ticket_types
                 WHERE evento_id = ?
                 ORDER BY nombre ASC`,
                [eventId]
            );
            return rows as TicketType[];
        } finally {
            connection.release();
        }
    }

    async createTicketType(eventId: number, nombre: string, initialPrice?: number): Promise<TicketType> {
        const connection = await db.pool.getConnection();
        try {
            const normalizedName = this.normalizeName(nombre);
            if (!normalizedName) {
                throw new Error("Ticket type name is required");
            }

            const [insertResult] = await connection.query(
                `INSERT INTO ticket_types (evento_id, nombre, activo) VALUES (?, ?, 1)`,
                [eventId, normalizedName]
            );

            const ticketTypeId = Number((insertResult as any).insertId);

            const [phasesRows] = await connection.query(
                `SELECT id, precio FROM fases WHERE evento_id = ? ORDER BY fecha_inicio ASC, id ASC`,
                [eventId]
            );
            const phases = phasesRows as Array<{ id: number; precio: number }>;

            for (const phase of phases) {
                await connection.query(
                    `INSERT INTO phase_ticket_type_prices (fase_id, ticket_type_id, precio)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE precio = VALUES(precio)`,
                    [phase.id, ticketTypeId, Number(initialPrice ?? phase.precio ?? 0)]
                );
            }

            const [rows] = await connection.query(
                `SELECT id, evento_id, nombre, activo, fecha_creacion
                 FROM ticket_types
                 WHERE id = ? AND evento_id = ?`,
                [ticketTypeId, eventId]
            );

            const result = rows as TicketType[];
            if (!result.length) {
                throw new Error("Failed to retrieve created ticket type");
            }

            return result[0] as TicketType;
        } finally {
            connection.release();
        }
    }

    async updateTicketType(eventId: number, ticketTypeId: number, data: { nombre?: string; activo?: boolean }): Promise<TicketType> {
        const connection = await db.pool.getConnection();
        try {
            const updates: string[] = [];
            const values: Array<string | number | boolean> = [];

            if (data.nombre !== undefined) {
                const normalizedName = this.normalizeName(data.nombre);
                if (!normalizedName) {
                    throw new Error("Ticket type name is required");
                }
                updates.push("nombre = ?");
                values.push(normalizedName);
            }

            if (data.activo !== undefined) {
                updates.push("activo = ?");
                values.push(data.activo);
            }

            if (!updates.length) {
                const [existingRows] = await connection.query(
                    `SELECT id, evento_id, nombre, activo, fecha_creacion
                     FROM ticket_types
                     WHERE id = ? AND evento_id = ?`,
                    [ticketTypeId, eventId]
                );
                const existing = existingRows as TicketType[];
                if (!existing.length) {
                    throw new Error("Ticket type not found");
                }
                return existing[0] as TicketType;
            }

            values.push(ticketTypeId);
            values.push(eventId);

            await connection.query(
                `UPDATE ticket_types SET ${updates.join(", ")} WHERE id = ? AND evento_id = ?`,
                values
            );

            const [rows] = await connection.query(
                `SELECT id, evento_id, nombre, activo, fecha_creacion
                 FROM ticket_types
                 WHERE id = ? AND evento_id = ?`,
                [ticketTypeId, eventId]
            );

            const result = rows as TicketType[];
            if (!result.length) {
                throw new Error("Ticket type not found");
            }
            return result[0] as TicketType;
        } finally {
            connection.release();
        }
    }

    async getPhaseTicketTypePrices(eventId: number, phaseId: number): Promise<PhaseTicketTypePrice[]> {
        const connection = await db.pool.getConnection();
        try {
            const [phaseRows] = await connection.query(
                `SELECT id, precio FROM fases WHERE id = ? AND evento_id = ?`,
                [phaseId, eventId]
            );
            const phase = (phaseRows as Array<{ id: number; precio: number }>)[0];
            if (!phase) {
                throw new Error("Phase not found");
            }

            const [ticketTypesRows] = await connection.query(
                `SELECT id FROM ticket_types WHERE evento_id = ? AND activo = 1`,
                [eventId]
            );
            const ticketTypeIds = ticketTypesRows as Array<{ id: number }>;

            for (const ticketType of ticketTypeIds) {
                await connection.query(
                    `INSERT INTO phase_ticket_type_prices (fase_id, ticket_type_id, precio)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE precio = phase_ticket_type_prices.precio`,
                    [phaseId, ticketType.id, Number(phase.precio ?? 0)]
                );
            }

            const [rows] = await connection.query(
                `SELECT tt.id AS ticket_type_id, tt.nombre, tt.activo, ptp.precio
                 FROM ticket_types tt
                 INNER JOIN phase_ticket_type_prices ptp ON ptp.ticket_type_id = tt.id
                 WHERE tt.evento_id = ? AND ptp.fase_id = ?
                 ORDER BY tt.nombre ASC`,
                [eventId, phaseId]
            );

            return rows as PhaseTicketTypePrice[];
        } finally {
            connection.release();
        }
    }

    async updatePhaseTicketTypePrice(eventId: number, phaseId: number, ticketTypeId: number, precio: number): Promise<PhaseTicketTypePrice> {
        const connection = await db.pool.getConnection();
        try {
            const [validRows] = await connection.query(
                `SELECT tt.id
                 FROM ticket_types tt
                 INNER JOIN fases f ON f.evento_id = tt.evento_id
                 WHERE tt.id = ? AND tt.evento_id = ? AND f.id = ?`,
                [ticketTypeId, eventId, phaseId]
            );

            if (!(validRows as any[]).length) {
                throw new Error("Ticket type or phase not found for event");
            }

            await connection.query(
                `INSERT INTO phase_ticket_type_prices (fase_id, ticket_type_id, precio)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE precio = VALUES(precio)`,
                [phaseId, ticketTypeId, precio]
            );

            const [rows] = await connection.query(
                `SELECT tt.id AS ticket_type_id, tt.nombre, tt.activo, ptp.precio
                 FROM ticket_types tt
                 INNER JOIN phase_ticket_type_prices ptp ON ptp.ticket_type_id = tt.id
                 WHERE tt.evento_id = ? AND ptp.fase_id = ? AND tt.id = ?`,
                [eventId, phaseId, ticketTypeId]
            );

            const result = rows as PhaseTicketTypePrice[];
            if (!result.length) {
                throw new Error("Failed to retrieve updated phase ticket type price");
            }

            return result[0] as PhaseTicketTypePrice;
        } finally {
            connection.release();
        }
    }

    async seedPhasePricesForNewPhase(eventId: number, phaseId: number): Promise<void> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT tt.id AS ticket_type_id,
                        COALESCE(
                            (
                                SELECT ptp2.precio
                                FROM phase_ticket_type_prices ptp2
                                INNER JOIN fases f2 ON f2.id = ptp2.fase_id
                                WHERE f2.evento_id = ? AND ptp2.ticket_type_id = tt.id AND f2.id <> ?
                                ORDER BY f2.fecha_inicio DESC, f2.id DESC
                                LIMIT 1
                            ),
                            (
                                SELECT e.precio_inicial FROM eventos e WHERE e.id = ?
                            ),
                            0
                        ) AS precio_base
                 FROM ticket_types tt
                 WHERE tt.evento_id = ? AND tt.activo = 1`,
                [eventId, phaseId, eventId, eventId]
            );

            const ticketTypeRows = rows as Array<{ ticket_type_id: number; precio_base: number }>;

            for (const ticketTypeRow of ticketTypeRows) {
                await connection.query(
                    `INSERT INTO phase_ticket_type_prices (fase_id, ticket_type_id, precio)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE precio = VALUES(precio)`,
                    [phaseId, ticketTypeRow.ticket_type_id, Number(ticketTypeRow.precio_base ?? 0)]
                );
            }
        } finally {
            connection.release();
        }
    }

    async createDefaultGeneralType(eventId: number, phaseId: number, precio: number): Promise<void> {
        const connection = await db.pool.getConnection();
        try {
            const [existingRows] = await connection.query(
                `SELECT id FROM ticket_types WHERE evento_id = ? AND nombre = 'GENERAL' LIMIT 1`,
                [eventId]
            );

            let ticketTypeId = Number((existingRows as Array<{ id: number }>)[0]?.id ?? 0);

            if (!ticketTypeId) {
                const [insertResult] = await connection.query(
                    `INSERT INTO ticket_types (evento_id, nombre, activo) VALUES (?, 'GENERAL', 1)`,
                    [eventId]
                );
                ticketTypeId = Number((insertResult as any).insertId);
            }

            await connection.query(
                `INSERT INTO phase_ticket_type_prices (fase_id, ticket_type_id, precio)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE precio = VALUES(precio)`,
                [phaseId, ticketTypeId, Number(precio ?? 0)]
            );
        } finally {
            connection.release();
        }
    }

    async getPriceForPhaseAndType(eventId: number, phaseId: number, typeName: string): Promise<number | null> {
        const connection = await db.pool.getConnection();
        try {
            const normalizedName = this.normalizeName(typeName);
            if (!normalizedName) {
                return null;
            }

            const [rows] = await connection.query(
                `SELECT ptp.precio
                 FROM phase_ticket_type_prices ptp
                 INNER JOIN ticket_types tt ON tt.id = ptp.ticket_type_id
                 WHERE tt.evento_id = ?
                   AND ptp.fase_id = ?
                   AND tt.nombre = ?
                   AND tt.activo = 1
                 LIMIT 1`,
                [eventId, phaseId, normalizedName]
            );

            const price = Number((rows as Array<{ precio: number }>)[0]?.precio);
            if (!Number.isFinite(price)) {
                return null;
            }

            return price;
        } finally {
            connection.release();
        }
    }
}
