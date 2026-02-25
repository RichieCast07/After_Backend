class PutUsersUseCase {
     constructor({ usersRepository }) {
         this.usersRepository = usersRepository;
     }
     
     async execute(id, userData) {
         if (!userData || typeof userData.username !== 'string' || userData.username.trim() === '') {
             const err = new Error('username is required and must be a non-empty string');
             err.statusCode = 400;
             throw err;
         }
         return this.usersRepository.putUsers(id, userData);
     }
}

module.exports = PutUsersUseCase;