import { getLoadingTemplate } from '../../utils/index.js';
import Camera from '../../utils/camera.js';
import L from 'leaflet';

export default class StoryView {
  #camera = null;
  #map = null;
  #marker = null;

  getTemplate() {
    return `
      <section class="auth-section" aria-labelledby="add-story-title">
        <div class="auth-card">
          <h1 class="auth-title" id="add-story-title">Add Story</h1>
          <form id="story-form" class="auth-form" enctype="multipart/form-data" aria-describedby="story-message">
            <div class="form-group">
              <label for="description">Description</label>
              <input id="description" name="description" type="text" required aria-required="true" />
            </div>
            <div class="form-group">
              <label for="photo">Photo</label>
              <input id="photo" name="photo" type="file" accept="image/*" aria-describedby="photo-desc" />
              <span id="photo-desc" class="visually-hidden">Choose a photo from your device or use the camera</span>
              <button type="button" id="camera-btn" class="auth-btn" style="margin-top:8px;">Use Camera</button>
              <video id="video-preview" width="100%" height="200" autoplay playsinline style="display:none;margin-top:8px;border-radius:8px;" aria-label="Camera preview"></video>
              <canvas id="canvas-capture" style="display:none;"></canvas>
              <button type="button" id="capture-btn" class="auth-btn" style="display:none;margin-top:8px;">Capture Photo</button>
              <img id="photo-preview" style="display:none;margin-top:8px;max-width:100%;border-radius:8px;" alt="Preview of captured photo" />
            </div>
            <div class="form-group">
              <label for="lat">Latitude (optional)</label>
              <input id="lat" name="lat" type="number" step="any" aria-describedby="lat-desc" />
              <span id="lat-desc" class="visually-hidden">Latitude for the story location</span>
            </div>
            <div class="form-group">
              <label for="lon">Longitude (optional)</label>
              <input id="lon" name="lon" type="number" step="any" aria-describedby="lon-desc" />
              <span id="lon-desc" class="visually-hidden">Longitude for the story location</span>
            </div>
            <div class="form-group">
              <div id="add-story-map" style="width:100%;height:250px;margin-bottom:1rem;border-radius:10px;overflow:hidden;" aria-label="Map for selecting location"></div>
            </div>
            <button type="submit" class="auth-btn">Add Story</button>
          </form>
          <p id="story-message" class="auth-message" aria-live="polite"></p>
        </div>
      </section>
    `;
  }

  showLoading() {
    document.getElementById('story-message').innerHTML = getLoadingTemplate('Uploading...');
  }

  hideLoading() {
    document.getElementById('story-message').innerHTML = '';
  }

  #initMap() {
    if (this.#map) {
      this.#map.remove();
      this.#map = null;
      this.#marker = null;
    }

    const mapContainer = document.getElementById('add-story-map');
    if (mapContainer) {
      mapContainer.innerHTML = '';
    }

    this.#map = L.map('add-story-map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.#map);

    this.#map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;
      this.#updateMarker(lat, lng);
    });
  }

  #updateMarker(lat, lon) {
    if (this.#marker) {
      this.#marker.setLatLng([lat, lon]);
    } else {
      this.#marker = L.marker([lat, lon]).addTo(this.#map);
    }
    this.#map.setView([lat, lon], 12);
  }

  bindAddStory(handler, onSuccess) {
    const form = document.getElementById('story-form');
    const cameraBtn = document.getElementById('camera-btn');
    const video = document.getElementById('video-preview');
    const captureBtn = document.getElementById('capture-btn');
    const canvas = document.getElementById('canvas-capture');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');
    const latInput = document.getElementById('lat');
    const lonInput = document.getElementById('lon');

    let capturedBlob = null;
    this.#camera = new Camera({ video });

    cameraBtn.addEventListener('click', async () => {
      try {
        await this.#camera.startCamera();
        captureBtn.style.display = 'inline-block';
        cameraBtn.style.display = 'none';
        photoInput.style.display = 'none';
        photoPreview.style.display = 'none';
      } catch (err) {
        alert(err.message || 'Could not access camera');
      }
    });

    captureBtn.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        capturedBlob = blob;
        photoPreview.src = URL.createObjectURL(blob);
        photoPreview.style.display = 'block';
      }, 'image/jpeg');
      this.#camera.stopCamera();
      captureBtn.style.display = 'none';
      cameraBtn.style.display = 'inline-block';
      photoInput.style.display = 'inline-block';
    });

    this.#initMap();

    latInput.addEventListener('input', () => {
      const lat = parseFloat(latInput.value);
      const lon = parseFloat(lonInput.value);
      if (!isNaN(lat) && !isNaN(lon)) {
        this.#updateMarker(lat, lon);
      }
    });
    lonInput.addEventListener('input', () => {
      const lat = parseFloat(latInput.value);
      const lon = parseFloat(lonInput.value);
      if (!isNaN(lat) && !isNaN(lon)) {
        this.#updateMarker(lat, lon);
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.showLoading();
      const description = document.getElementById('description').value;
      const lat = latInput.value;
      const lon = lonInput.value;
      let photo = photoInput.files[0];
      if (capturedBlob) {
        photo = new File([capturedBlob], 'camera-photo.jpg', { type: 'image/jpeg' });
      }
      const result = await handler({
        description,
        photo,
        lat: lat ? parseFloat(lat) : undefined,
        lon: lon ? parseFloat(lon) : undefined,
      });
      this.hideLoading();
      capturedBlob = null;
      photoPreview.style.display = 'none';
      if (result.success && typeof onSuccess === 'function') {
        onSuccess();
      }
    });
  }

  showMessage(msg) {
    document.getElementById('story-message').textContent = msg;
  }
}