import CONFIG from '../config.js';
import { subscribePush, unsubscribePush } from '../data/api.js';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const swUrl = `${import.meta.env.BASE_URL}sw-workbox.js`;
    return navigator.serviceWorker.register(swUrl);
  }
  throw new Error('Service Worker not supported');
}

export async function subscribePushNotification(token) {
  const registration = await registerServiceWorker();
  await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    });
  }

  return subscribePush(token, subscription);
}

export async function unsubscribePushNotification(token) {
  const swUrl = `${import.meta.env.BASE_URL}sw-workbox.js`;
  const registration = await navigator.serviceWorker.getRegistration(swUrl);
  if (!registration) return;

  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await subscription.unsubscribe();

  return unsubscribePush(token, subscription);
}

export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function getLoadingTemplate(message = "Loading...") {
  return `
    <div class="loading-indicator" aria-live="polite" aria-busy="true">
      <div class="spinner"></div>
      <span>${message}</span>
    </div>
  `;
}

export function renderNav() {
  const navList = document.getElementById('nav-list');
  const isLoggedIn = !!localStorage.getItem('token');

  navList.innerHTML = `
    <li><a href="#/">Beranda</a></li>
    ${isLoggedIn
      ? `
        <li><a href="#/add-story">Add Story</a></li>
        <li><a href="#" id="logout-link">Logout</a></li>
      `
      : `<li><a href="#/login">Login</a></li>
         <li><a href="#/register">Register</a></li>`
    }
  `;

  if (isLoggedIn) {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.hash = '/login';
        renderNav();
      });
    }
  }
}

export async function handlePushNotificationSubscription(token) {
  if (Notification.permission === 'denied') {
    alert('You have blocked notifications. Please enable them in your browser settings to receive push notifications.');
  } else {
    try {
      await subscribePushNotification(token);
      alert('Push notifications subscribed successfully!');
    } catch (err) {
      alert(`Failed to subscribe to push notifications: ${err.message}`);
    }
  }
}