export default class RegisterPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async handleRegister({ name, email, password }) {
    this.#view.showLoading();
    const result = await this.#model.register(name, email, password);
    this.#view.hideLoading();
    if (result.error) {
      this.#view.showMessage(result.message || 'Registration failed');
      return { success: false };
    } else {
      this.#view.showMessage('Registration successful! Please login.');
      return { success: true };
    }
  }
}