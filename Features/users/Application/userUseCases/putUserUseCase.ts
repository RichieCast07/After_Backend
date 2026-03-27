import { HttpErrors } from "../../../../Core/dberrors.js";
import type { User } from "../../Domain/Data/user.js";
import type { UserRepository } from "../../Domain/Repository/userRepository.js";

interface PutUsersUseCaseDeps {
    usersRepository: UserRepository;
}

export class PutUsersUseCase {
    private readonly usersRepository: UserRepository;

    constructor({ usersRepository }: PutUsersUseCaseDeps) {
        this.usersRepository = usersRepository;
    }

    async execute(id: number, userData: Partial<User>): Promise<any> {
        if (!userData || typeof userData.username !== 'string' || userData.username.trim() === '') {
            throw HttpErrors.badRequest('username is required and must be a non-empty string');
        }
        
        return this.usersRepository.putUsers(id, userData as User);
    }
}
