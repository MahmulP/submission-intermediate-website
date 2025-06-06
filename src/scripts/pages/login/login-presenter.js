export default class LoginPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async handleLogin({ email, password }) {
    this.#view.showLoading();
    const result = await this.#model.login(email, password);
    this.#view.hideLoading();
    if (!result.error) {
      this.#view.showMessage('Login successful! Redirecting...');
      return { success: true };
    } else {
      this.#view.showMessage(result.message || 'Login failed');
      return { success: false };
    }
  }
}