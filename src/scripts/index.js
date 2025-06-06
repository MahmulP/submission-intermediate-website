// CSS imports
import '../styles/styles.css';

import App from './pages/app';
import Camera from './utils/camera';
import { subscribePushNotification } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (!sessionStorage.getItem('pushSubscribed')) {
      const token = localStorage.getItem('token');
      if (token) {
        let permission = Notification.permission;
        if (permission === 'default') {
          permission = await Notification.requestPermission();
        }
        if (permission === 'granted') {
          try {
            await subscribePushNotification(token);
            alert('Push notifications subscribed successfully!');
            sessionStorage.setItem('pushSubscribed', 'true');
          } catch (err) {
            alert(`Failed to subscribe to push notifications: ${err.message}`);
          }
        } else if (permission === 'denied') {
          alert('You have blocked notifications. Please enable them in your browser settings to receive push notifications.');
        }
      }
    }
  } catch (err) {
    console.error('Push subscription error:', err);
  }

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    Camera.stopAllStreams();
    await app.renderPage();
  });

  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-link");
  if (skipLink && mainContent) {
    skipLink.addEventListener("click", function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }
});
