import type { User } from "../../Domain/Data/user.js";
import type { UserRepository } from "../../Domain/Repository/userRepository.js";

export class GetUsersUseCase {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(): Promise<User[]> {
        return this.userRepository.getUsers();
    }
}
