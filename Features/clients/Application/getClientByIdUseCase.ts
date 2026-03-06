import type { Client } from "../Domain/Data/client.js";
import type { ClientRepository } from "../Domain/Repository/clientRepository.js";

export class GetClientByIdUseCase {
    private readonly clientRepository: ClientRepository;

    constructor(clientRepository: ClientRepository) {
        this.clientRepository = clientRepository;
    }

    async execute(clientId: number): Promise<Client | null> {
        return this.clientRepository.getClientById(clientId);
    }
}
