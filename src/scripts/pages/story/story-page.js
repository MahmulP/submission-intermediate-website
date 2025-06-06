import StoryView from './story-view.js';
import StoryPresenter from './story-presenter.js';
import StoryModel from '../../models/story-model.js';

export default class StoryPage {
  constructor() {
    this.view = new StoryView();
    this.model = new StoryModel();
    this.presenter = new StoryPresenter({ model: this.model, view: this.view });
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    this.view.bindAddStory(
      this.presenter.handleAddStory.bind(this.presenter),
      () => { window.location.hash = '/'; }
    );
  }
}