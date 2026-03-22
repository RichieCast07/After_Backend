import { createHmac, timingSafeEqual } from "node:crypto";

export interface PublicTicketTokenPayload {
    codigo: string;
    rp_id: number;
    codigo_evento: string;
    cliente_nombre?: string;
    cliente_telefono?: string;
}

function getSigningSecret(): string {
    return process.env.TICKET_PUBLIC_LINK_SECRET
        ?? process.env.JWT_SECRET
        ?? "dev-ticket-link-secret";
}

function toBase64Url(value: string): string {
    return Buffer.from(value, "utf8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const remainder = normalized.length % 4;
    const padded = remainder === 0 ? normalized : `${normalized}${"=".repeat(4 - remainder)}`;
    return Buffer.from(padded, "base64").toString("utf8");
}

function signTokenPart(encodedPayload: string): string {
    return createHmac("sha256", getSigningSecret())
        .update(encodedPayload)
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

export function signPublicTicketToken(payload: PublicTicketTokenPayload): string {
    const encodedPayload = toBase64Url(JSON.stringify(payload));
    const signature = signTokenPart(encodedPayload);
    return `${encodedPayload}.${signature}`;
}

export function verifyPublicTicketToken(token: string): PublicTicketTokenPayload | null {
    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
        return null;
    }

    const expectedSignature = signTokenPart(encodedPayload);
    const received = Buffer.from(signature, "utf8");
    const expected = Buffer.from(expectedSignature, "utf8");

    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
        return null;
    }

    try {
        const parsed = JSON.parse(fromBase64Url(encodedPayload)) as Partial<PublicTicketTokenPayload>;

        if (
            typeof parsed.codigo !== "string"
            || typeof parsed.codigo_evento !== "string"
            || typeof parsed.rp_id !== "number"
        ) {
            return null;
        }

        return {
            codigo: parsed.codigo,
            codigo_evento: parsed.codigo_evento,
            rp_id: parsed.rp_id,
            cliente_nombre: typeof parsed.cliente_nombre === "string" ? parsed.cliente_nombre : undefined,
            cliente_telefono: typeof parsed.cliente_telefono === "string" ? parsed.cliente_telefono : undefined,
        };
    } catch {
        return null;
    }
}

function normalizeFrontendUrl(url: string): string {
    return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function buildPublicTicketUrl(token: string): string {
    const frontendPublicUrl = normalizeFrontendUrl(
        process.env.FRONTEND_PUBLIC_URL
        ?? process.env.CLIENT_PUBLIC_URL
        ?? "http://localhost:5173"
    );

    return `${frontendPublicUrl}/ticket/${encodeURIComponent(token)}`;
}