import type { Client } from "../Domain/Data/client.js";
import type { ClientRepository } from "../Domain/Repository/clientRepository.js";

export class GetClientsUseCase {
    private readonly clientRepository: ClientRepository;

    constructor(clientRepository: ClientRepository) {
        this.clientRepository = clientRepository;
    }

    async execute(): Promise<Client[]> {
        return this.clientRepository.getClients();
    }
}
