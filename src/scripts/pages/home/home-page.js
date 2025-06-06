import HomeView from './home-view.js';
import HomePresenter from './home-presenter.js';
import StoryModel from '../../models/story-model.js';

export default class HomePage {
  constructor() {
    this.view = new HomeView();
    this.model = new StoryModel();
    this.presenter = new HomePresenter({ model: this.model, view: this.view });
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    await this.presenter.loadStories();
    this.view.bindDeleteStory(
      this.presenter.handleDeleteStory.bind(this.presenter)
    );
  }
}
