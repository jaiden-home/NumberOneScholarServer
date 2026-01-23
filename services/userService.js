const userRepository = require('../data/mysql/userRepository');
const { BusinessLogicError } = require('../utils/errors');

class UserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async getUserById(id) {
    return userRepository.findById(id);
  }

  async createUser(userData) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BusinessLogicError('Email already exists');
    }

    // Hash password (in a real-world app, you would use bcrypt here)
    // For simplicity, we'll just store the password as-is (not recommended for production)

    return userRepository.create(userData);
  }

  async updateUser(id, updates) {
    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    // If email is being updated, check if new email already exists
    if (updates.email && updates.email !== existingUser.email) {
      const userWithEmail = await userRepository.findByEmail(updates.email);
      if (userWithEmail) {
        throw new BusinessLogicError('Email already exists');
      }
    }

    return userRepository.update(id, updates);
  }

  async deleteUser(id) {
    const result = await userRepository.delete(id);
    return result > 0;
  }
}

module.exports = new UserService();