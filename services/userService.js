const userRepository = require('../data/mysql/userRepository');
const { BusinessLogicError } = require('../utils/errors');
const bcrypt = require('bcrypt');

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

    // Hash password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user with hashed password
    return userRepository.create({
      ...userData,
      password: hashedPassword
    });
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

    // Hash password if being updated
    if (updates.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updates.password, saltRounds);
      updates.password = hashedPassword;
    }

    return userRepository.update(id, updates);
  }

  async deleteUser(id) {
    const result = await userRepository.delete(id);
    return result > 0;
  }

  async login(email, password) {
    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new BusinessLogicError('Invalid email or password');
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BusinessLogicError('Invalid email or password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new UserService();