import { getLoadingTemplate } from '../../utils/index.js';
import L from 'leaflet';

export default class HomeView {
  #map = null;
  #markers = [];

  getTemplate() {
    return `
      <section class="container">
        <h1>Stories</h1>
        <div id="map" style="width:100%;height:350px;margin-bottom:2rem;border-radius:10px;overflow:hidden;"></div>
        <div id="stories-list"></div>
        <p id="stories-error" aria-live="polite"></p>
      </section>
    `;
  }

  showLoading() {
    document.getElementById('stories-list').innerHTML = getLoadingTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list').innerHTML = '';
  }

  renderMap(storiesWithLocation) {
    if (this.#map) {
      this.#map.remove();
      this.#map = null;
      this.#markers = [];
    }

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.innerHTML = '';
    }

    this.#map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.#map);

    this.#markers = [];

    storiesWithLocation.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.#map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
        this.#markers.push(marker);
      }
    });

    if (this.#markers.length > 0) {
      const group = new L.featureGroup(this.#markers);
      this.#map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  renderStories(stories) {
    this.hideLoading();
    const storiesList = document.getElementById('stories-list');
    storiesList.innerHTML = stories.map(story => `
      <article class="story-card" aria-labelledby="story-title-${story.id}">
        <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-img" />
        <div class="story-info">
          <h2 class="story-title" id="story-title-${story.id}">${story.name}</h2>
          <p class="story-desc">${story.description}</p>
          <p class="story-date">${new Date(story.createdAt).toLocaleString()}</p>
          <button class="delete-story-btn" data-id="${story.id}">Delete</button>
        </div>
      </article>
    `).join('');
  }

  showError(message) {
    this.hideLoading();
    document.getElementById('stories-error').textContent = message;
  }

  clearError() {
    document.getElementById('stories-error').textContent = '';
  }

  bindDeleteStory(onDelete) {
    const storiesList = document.getElementById('stories-list');
    storiesList.addEventListener('click', async (e) => {
      if (e.target.classList.contains('delete-story-btn')) {
        const id = e.target.dataset.id;
        if (confirm('Are you sure you want to delete this story?')) {
          await onDelete(id);
        }
      }
    });
  }
}