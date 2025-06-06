import LoginView from './login-view.js';
import LoginPresenter from './login-presenter.js';
import AuthModel from '../../models/auth-model.js';

export default class LoginPage {
  constructor() {
    this.view = new LoginView();
    this.model = new AuthModel();
    this.presenter = new LoginPresenter({ model: this.model, view: this.view });
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    this.view.bindLogin(
      this.presenter.handleLogin.bind(this.presenter),
      () => { window.location.hash = '/'; }
    );
  }
}