export default class StoryPresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async handleAddStory({ description, photo, lat, lon }) {
    try {
      const result = await this.#model.addStory({ description, photo, lat, lon });
      this.#view.showMessage('Story added successfully!');
      return { success: true };
    } catch (err) {
      this.#view.showMessage(err.message || 'Failed to add story.');
      return { success: false };
    }
  }
}