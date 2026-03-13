import type { Event } from "../../Domain/Data/event.js";
import type { CreateEventDTO } from "../../Domain/Data/createEventDTO.js";
import type { UpdateEventDTO } from "../../Domain/Data/updateEventDTO.js";
import { EventRepository } from "../../Domain/Repository/eventRepository.js";
import db from "../../../../Core/db.js";
import { randomBytes } from "node:crypto";

export class MySQLEventRepository extends EventRepository {
    private generateEventCode(): string {
        return `EVT-${randomBytes(4).toString("hex").toUpperCase()}`;
    }

    async getEvents(): Promise<Event[]> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT e.id, e.nombre, e.codigo_evento, e.fecha_evento, e.lugar, e.activo, e.fecha_creacion,
                        (
                            SELECT f.precio
                            FROM fases f
                            WHERE f.evento_id = e.id
                            ORDER BY f.fecha_inicio ASC, f.id ASC
                            LIMIT 1
                        ) AS precio_inicial
                 FROM eventos e`
            );
            return rows as Event[];
        } finally {
            connection.release();
        }
    }

    async getEventById(eventId: number): Promise<Event | null> {
        const connection = await db.pool.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT e.id, e.nombre, e.codigo_evento, e.fecha_evento, e.lugar, e.activo, e.fecha_creacion,
                        (
                            SELECT f.precio
                            FROM fases f
                            WHERE f.evento_id = e.id
                            ORDER BY f.fecha_inicio ASC, f.id ASC
                            LIMIT 1
                        ) AS precio_inicial
                 FROM eventos e
                 WHERE e.id = ?`,
                [eventId]
            );
            const events = rows as Event[];
            return events.length > 0 ? (events[0] as Event) : null;
        } finally {
            connection.release();
        }
    }

    async createEvent(event: CreateEventDTO): Promise<Event> {
        const connection = await db.pool.getConnection();
        try {
            const eventCode = this.generateEventCode();
            const [result] = await connection.query(
                "INSERT INTO eventos (nombre, codigo_evento, fecha_evento, lugar) VALUES (?, ?, ?, ?)",
                [event.nombre, eventCode, event.fecha_evento, event.lugar]
            );
            const insertId = (result as any).insertId;
            const created = await this.getEventById(insertId);
            if (!created) throw new Error("Failed to retrieve created event");
            return created;
        } finally {
            connection.release();
        }
    }

    async updateEvent(eventId: number, event: UpdateEventDTO): Promise<Event> {
        const connection = await db.pool.getConnection();
        try {
            const updates: string[] = [];
            const values: any[] = [];

            if (event.nombre !== undefined) {
                updates.push("nombre = ?");
                values.push(event.nombre);
            }
            if (event.fecha_evento !== undefined) {
                updates.push("fecha_evento = ?");
                values.push(event.fecha_evento);
            }
            if (event.lugar !== undefined) {
                updates.push("lugar = ?");
                values.push(event.lugar);
            }

            if (updates.length === 0) {
                const existing = await this.getEventById(eventId);
                if (!existing) throw new Error("Event not found");
                return existing;
            }

            values.push(eventId);
            await connection.query(
                `UPDATE eventos SET ${updates.join(", ")} WHERE id = ?`,
                values
            );

            const updated = await this.getEventById(eventId);
            if (!updated) throw new Error("Failed to retrieve updated event");
            return updated;
        } finally {
            connection.release();
        }
    }

    async toggleEventStatus(eventId: number): Promise<Event> {
        const connection = await db.pool.getConnection();
        try {
            const existing = await this.getEventById(eventId);
            if (!existing) throw new Error("Event not found");

            await connection.query(
                "UPDATE eventos SET activo = NOT activo WHERE id = ?",
                [eventId]
            );

            const updated = await this.getEventById(eventId);
            if (!updated) throw new Error("Failed to retrieve updated event");
            return updated;
        } finally {
            connection.release();
        }
    }

    async deleteEvent(eventId: number): Promise<void> {
        const connection = await db.pool.getConnection();
        try {
            const existing = await this.getEventById(eventId);
            if (!existing) throw new Error("Event not found");

            await connection.query("DELETE FROM eventos WHERE id = ?", [eventId]);
        } finally {
            connection.release();
        }
    }
}
