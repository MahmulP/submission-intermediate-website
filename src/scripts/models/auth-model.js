import * as api from '../data/api.js';

export default class AuthModel {
  async login(email, password) {
    return api.login(email, password);
  }
  async register(name, email, password) {
    return api.register(name, email, password);
  }
}