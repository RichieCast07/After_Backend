import type { Client } from "../Domain/Data/client.js";
import type { ClientRepository } from "../Domain/Repository/clientRepository.js";

export class GetClientByPhoneUseCase {
    private readonly clientRepository: ClientRepository;

    constructor(clientRepository: ClientRepository) {
        this.clientRepository = clientRepository;
    }

    async execute(phone: string): Promise<Client | null> {
        return this.clientRepository.getClientByPhone(phone);
    }
}
