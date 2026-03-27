import { HttpErrors } from "../../../../Core/dberrors.js";
import type { UserRepository } from "../../Domain/Repository/userRepository.js";

interface DeleteUserUseCaseDeps {
    userRepository: UserRepository;
}

export class DeleteUserUseCase {
    private readonly userRepository: UserRepository;

    constructor({ userRepository }: DeleteUserUseCaseDeps) {
        this.userRepository = userRepository;
    }

    async execute(id: number): Promise<void> {
        const user = await this.userRepository.getUsersById(id);
        
        if (!user) {
            throw HttpErrors.notFound(`User with ID ${id} not found`);
        }
        
        await this.userRepository.deleteUsers(id);
    }
}
