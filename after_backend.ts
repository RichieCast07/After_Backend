import express from "express";
import type { Request, Response } from "express";
import dotenv from 'dotenv';
import db from "./Core/db.js";
import corsM from "./Core/Middleware/cors.js";
import { init_users } from "./Features/users/infrastructure/dependences.js";
import { initFeatures } from "./Features/init.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(corsM);
app.use(express.json());

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    process.exit(1);
});

(async function start() {
    try {
        const dbErr = await db.testConnection();
        if (dbErr) {
            console.error('DB connection failed:', dbErr);
            process.exit(1); 
        }
        console.log('Conexion a la base de datos Lista');
        
        init_users(app);
        initFeatures(app);

        app.get('/health', async (req: Request, res: Response) => {
            try {
                const err = await db.testConnection();
                if (err) return res.status(500).json({ status: 'unhealthy', error: String(err) });
                return res.json({ status: 'ok' });
            } catch (error) {
                return res.status(500).json({ status: "unhealthy", error: String(error) });
            }
        });

        app.listen(PORT, () => {
            console.log('Servidor escuchando en el puerto ' + PORT);
        });
    } catch (err) {
        console.error('Failed during startup:', err);
        process.exit(1);
    }
})();