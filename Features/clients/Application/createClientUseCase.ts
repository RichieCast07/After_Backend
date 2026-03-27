import type { Client } from "../Domain/Data/client.js";
import type { ClientRepository } from "../Domain/Repository/clientRepository.js";
import type { CreateClientDTO } from "../Domain/Data/createClientDTO.js";

export class CreateClientUseCase {
    private readonly clientRepository: ClientRepository;

    constructor(clientRepository: ClientRepository) {
        this.clientRepository = clientRepository;
    }

    async execute(client: CreateClientDTO): Promise<Client> {
        return this.clientRepository.createClient(client);
    }
}
