const bcrypt = require('bcryptjs');

class InMemoryUserRepository {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  /*

  async postUsers(user) {
    // Hash password if present
    let passwordToSave = user.password;
    if (passwordToSave !== undefined && passwordToSave !== null) {
      passwordToSave = await bcrypt.hash(passwordToSave, 10);
    }
    const newUser = { id: this.nextId++, name: user.name, email: user.email, password: passwordToSave };
    this.users.push(newUser);
    return newUser;
  }


  */

  
  async getUsers() {
    return this.users.slice();
  }

  async getUsersById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  async deleteUsers(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  async putUsers(updatedUser) {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      return this.users[index];
    }
    return null;
  }

  async loginUser(email, password) {
    const user = this.users.find(user => user.email === email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password || '');
    return match ? user : null;
  }

  async registerUser(user) {
    const hashed = await bcrypt.hash(user.password, 10);
    const newUser = { id: this.nextId++, name: user.name, email: user.email, password: hashed };
    this.users.push(newUser);
    return newUser;
  }
}

module.exports = InMemoryUserRepository;
