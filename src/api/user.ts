/**
 * @module API
 */

import { IUser } from '@type/user';
import { IResponse } from '@type/api';

import instance from '@api/api';

/**
 * Class for working with users
 */

class UserAPI {
  /**
   * Method for getting a user by ID
   * @param id user ID
   */

  static async getUserByID(id: string) {
    try {
      const response = await instance.get<IResponse<IUser>>(`user?id=${id}`);
      return response.data.data;
    } catch (err) {
      throw new Error('Ooops!');
    }
  }

  /**
   * Method to get all users
   */

  static async getAllUsers() {
    try {
      const response = await instance.get<IResponse<IUser[]>>('users');
      return response.data.data;
    } catch (err) {
      throw new Error('Ooops!');
    }
  }

  /**
   * Method for adding a new user to the database
   * @param name new user`s name
   */

  static async addUser(name: string) {
    try {
      const response = await instance.post<IResponse<IUser>>('user', { name });
      return response.data.data;
    } catch (err) {
      throw new Error('Ooops!');
    }
  }

  /**
   * Method for complex modification of user data (name, wishlist, shopping cart)
   * @param user complete user data
   */

  static async changeUserData(user: IUser) {
    try {
      const response = await instance.post<IResponse<IUser>>('userData', {
        data: user,
      });
      return response.data.data;
    } catch (err) {
      throw new Error('Ooops!');
    }
  }
}

export default UserAPI;
