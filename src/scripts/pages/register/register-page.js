import RegisterView from './register-view.js';
import RegisterPresenter from './register-presenter.js';
import AuthModel from '../../models/auth-model.js';

export default class RegisterPage {
  constructor() {
    this.view = new RegisterView();
    this.model = new AuthModel();
    this.presenter = new RegisterPresenter({ model: this.model, view: this.view });
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    this.view.bindRegister(
      this.presenter.handleRegister.bind(this.presenter),
      () => { window.location.hash = '/login'; }
    );
  }
}