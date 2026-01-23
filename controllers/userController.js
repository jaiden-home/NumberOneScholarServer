const userService = require('../services/userService');
const { NotFoundError } = require('../utils/errors');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        status: 'success',
        data: {
          users
        },
        requestId: req.requestId
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }
      res.status(200).json({
        status: 'success',
        data: {
          user
        },
        requestId: req.requestId
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await userService.createUser({ name, email, password });
      res.status(201).json({
        status: 'success',
        data: {
          user
        },
        requestId: req.requestId
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = await userService.updateUser(id, updates);
      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }
      res.status(200).json({
        status: 'success',
        data: {
          user
        },
        requestId: req.requestId
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);
      if (!deleted) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();