import { getLoadingTemplate, showFormattedDate } from '../../utils/index.js';

export default class DetailStoryView {
  getTemplate() {
    return `
      <section class="container">
        <div id="detail-story-content"></div>
        <p id="detail-story-error" class="auth-message" aria-live="polite"></p>
      </section>
    `;
  }

  showLoading() {
    document.getElementById('detail-story-content').innerHTML = getLoadingTemplate('Loading...');
  }

  renderDetail(story) {
    document.getElementById('detail-story-content').innerHTML = `
      <article class="story-card" style="max-width:600px;margin:auto;">
        <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-img" style="width:100%;max-width:350px;display:block;margin:auto;" />
        <div class="story-info" style="margin-top:1rem;">
          <h2 class="story-title">${story.name}</h2>
          <p class="story-desc">${story.description}</p>
          <p class="story-date">${showFormattedDate(story.createdAt)}</p>
          ${story.lat && story.lon ? `<p>Location: ${story.lat}, ${story.lon}</p>` : ''}
        </div>
      </article>
    `;
  }

  showError(message) {
    document.getElementById('detail-story-error').textContent = message;
  }

  clearError() {
    document.getElementById('detail-story-error').textContent = '';
  }
}