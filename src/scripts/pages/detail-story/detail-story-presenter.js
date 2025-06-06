export default class DetailStoryPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async loadDetail(id) {
    this.#view.showLoading();
    try {
      const data = await this.#model.getStoryDetail(id);
      if (data.error) {
        this.#view.showError(data.message || 'Failed to fetch story detail.');
      } else {
        this.#view.renderDetail(data.story);
        this.#view.clearError();
      }
    } catch (err) {
      this.#view.showError('Failed to fetch story detail.');
    }
  }
}