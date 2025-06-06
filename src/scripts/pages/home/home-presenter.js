import { saveStory, getAllStories, deleteStory } from "../../utils/indexed-db";

export default class HomePresenter {
  #model;
  #view;

  constructor({ model, view }) {
    this.#model = model;
    this.#view = view;
  }

  async loadStories() {
    this.#view.showLoading();
    try {
      const dataWithLocation = await this.#model.getStoriesWithLocation();
      if (dataWithLocation.error) {
        const offlineStories = await getAllStories();
        if (offlineStories.length) {
          this.#view.renderMap(offlineStories);
          this.#view.renderStories(offlineStories);
          this.#view.clearError();
          return;
        }
        this.#view.showError('You must be logged in to see stories.');
        return;
      }

      dataWithLocation.listStory.forEach((story) => saveStory(story));
      this.#view.renderMap(dataWithLocation.listStory);

      const data = await this.#model.getStories();
      if (data.error) {
        this.#view.showError('You must be logged in to see stories.');
      } else {
        this.#view.renderStories(data.listStory);
        this.#view.clearError();
      }
    } catch (err) {
      const offlineStories = await getAllStories();
      if (offlineStories.length) {
        this.#view.renderMap(offlineStories);
        this.#view.renderStories(offlineStories);
        this.#view.clearError();
        return;
      }
      this.#view.showError('You must be logged in to see stories.');
    }
  }

  async handleDeleteStory(id) {
    await deleteStory(id);
    const stories = await getAllStories();
    this.#view.renderStories(stories);
  }
}