import type { Client } from "../Data/client.js";
import type { CreateClientDTO } from "../Data/createClientDTO.js";

export abstract class ClientRepository {
    abstract getClients(): Promise<Client[]>;

    abstract getClientsPortfolioForCsv(): Promise<Client[]>;

    abstract getClientById(clientId: number): Promise<Client | null>;

    abstract getClientByPhone(phone: string): Promise<Client | null>;

    abstract createClient(client: CreateClientDTO): Promise<Client>;

    abstract deleteClient(clientId: number): Promise<void>;
}
