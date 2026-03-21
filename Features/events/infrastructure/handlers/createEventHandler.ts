import type { Request, Response } from "express";
import type { CreateEventUseCase } from "../../Application/createEventUseCase.js";
import type { CreateEventDTO } from "../../Domain/Data/createEventDTO.js";

export class CreateEventHandler {
    private readonly createEventUseCase: CreateEventUseCase;

    constructor(createEventUseCase: CreateEventUseCase) {
        this.createEventUseCase = createEventUseCase;
    }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { nombre, fecha_evento, lugar, maps_url, precio_inicial } = req.body as CreateEventDTO;
            const missingFields: string[] = [];

            if (!nombre) {
                missingFields.push("nombre");
            }

            if (!fecha_evento) {
                missingFields.push("fecha_evento");
            }

            if (precio_inicial === undefined || precio_inicial === null || precio_inicial === "") {
                missingFields.push("precio_inicial");
            }

            if (missingFields.length > 0) {
                res.status(400).json({
                    error: "Missing required fields",
                    details: missingFields,
                    received: req.body ?? null
                });
                return;
            }

            if (Number(precio_inicial) <= 0) {
                res.status(400).json({ error: "Initial price must be greater than 0" });
                return;
            }

            const event = await this.createEventUseCase.execute({
                nombre,
                fecha_evento: new Date(fecha_evento),
                lugar,
                maps_url,
                precio_inicial: Number(precio_inicial)
            });

            res.status(201).json(event);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    }
}
