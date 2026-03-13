import twilio from "twilio";

export class WhatsappService {
    private readonly accountSid: string;
    private readonly authToken: string;
    private readonly fromNumber: string;
    private readonly serverPublicUrl: string;

    constructor() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID ?? "";
        this.authToken = process.env.TWILIO_AUTH_TOKEN ?? "";
        this.fromNumber = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";
        this.serverPublicUrl = process.env.SERVER_PUBLIC_URL ?? "http://18.210.101.203:3000";
    }

    async sendTicketQr(ticket: {
        codigo: string;
        cliente_nombre?: string;
        cliente_telefono?: string;
        codigo_evento?: string;
    }): Promise<void> {
        const phone = this.formatPhone(ticket.cliente_telefono ?? "");
        if (!phone) {
            console.warn(`[WhatsApp] Número inválido para boleto ${ticket.codigo}: "${ticket.cliente_telefono}"`);
            return;
        }

        const client = twilio(this.accountSid, this.authToken);
        const qrUrl = `${this.serverPublicUrl}/tickets/${ticket.codigo}/qr`;

        await client.messages.create({
            from: this.fromNumber,
            to: `whatsapp:${phone}`,
            body:
                `¡Hola ${ticket.cliente_nombre}! 🎉\n` +
                `Tu boleto para el evento *${ticket.codigo_evento}* ha sido registrado exitosamente.\n\n` +
                `📌 Código: *${ticket.codigo}*\n\n` +
                `Presenta este QR en la entrada del evento. ¡Nos vemos pronto!`,
            mediaUrl: [qrUrl],
        });

        console.log(`[WhatsApp] QR enviado a ${phone} para boleto ${ticket.codigo}`);
    }

    private formatPhone(telefono: string): string {
        const digits = telefono.replace(/\D/g, "");
        if (digits.startsWith("52") && digits.length === 12) return `+${digits}`;
        if (digits.length === 10) return `+52${digits}`;
        if (telefono.startsWith("+") && digits.length >= 11) return `+${digits}`;
        return "";
    }
}
