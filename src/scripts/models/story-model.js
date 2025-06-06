import * as api from '../data/api.js';

export default class StoryModel {
  async getStories() {
    return api.getStories();
  }

  async addStory({ description, photo, lat, lon }) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to add a story.');
    }

    const response = await api.addStory({ description, photo, lat, lon });
    if (response.error) {
      throw new Error(response.message || 'Failed to add story.');
    }

    return response;
  }

  async getStoryDetail(id) {
    return api.getStoryDetail(id);
  }

  async getStoriesWithLocation() {
    return api.getStoriesWithLocation();
  }
}