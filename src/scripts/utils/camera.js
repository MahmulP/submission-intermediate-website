export default class Camera {
  #currentStream = null;
  #videoElement = null;

  static addNewStream(stream) {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [stream];
      return;
    }
    window.currentStreams = [...window.currentStreams, stream];
  }

  static stopAllStreams() {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [];
      return;
    }
    window.currentStreams.forEach((stream) => {
      if (stream && stream.active) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });
    window.currentStreams = [];
  }

  constructor({ video }) {
    this.#videoElement = video;
  }

  async startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera not supported');
    }
    this.#currentStream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.#videoElement.srcObject = this.#currentStream;
    this.#videoElement.style.display = 'block';
    Camera.addNewStream(this.#currentStream);
    return this.#currentStream;
  }

  stopCamera() {
    if (this.#currentStream) {
      this.#currentStream.getTracks().forEach((track) => track.stop());
      this.#currentStream = null;
    }
    this.#videoElement.srcObject = null;
    this.#videoElement.style.display = 'none';
  }
}