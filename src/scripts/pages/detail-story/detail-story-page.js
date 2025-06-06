import DetailStoryView from './detail-story-view.js';
import DetailStoryPresenter from './detail-story-presenter.js';
import StoryModel from '../../models/story-model.js';
import { parseActivePathname } from '../../routes/url-parser.js';

export default class DetailStoryPage {
  constructor() {
    this.view = new DetailStoryView();
    this.model = new StoryModel();
    this.presenter = new DetailStoryPresenter({ model: this.model, view: this.view });
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    const { id } = parseActivePathname();
    if (id) {
      await this.presenter.loadDetail(id);
    } else {
      this.view.showError('No story ID provided.');
    }
  }
}