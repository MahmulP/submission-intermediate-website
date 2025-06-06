import CONFIG from "../config";

const endpoints = {
  register: `${CONFIG.BASE_URL}/register`,
  login: `${CONFIG.BASE_URL}/login`,
  stories: `${CONFIG.BASE_URL}/stories`,
  storiesGuest: `${CONFIG.BASE_URL}/stories/guest`,
  storyDetail: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  notificationsSubscribe: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

function getToken() {
  return localStorage.getItem('token');
}

export async function login(email, password) {
  const response = await fetch(endpoints.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!data.error && data.loginResult?.token) {
    localStorage.setItem('token', data.loginResult.token);
  }
  return data;
}

export async function register(name, email, password) {
  const response = await fetch(endpoints.register, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
}

export async function getStories({ page = 1, size = 10 } = {}) {
  const token = getToken();
  const params = new URLSearchParams({ page, size });
  const response = await fetch(`${endpoints.stories}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getStoriesWithLocation({ page = 1, size = 10 } = {}) {
  const token = getToken();
  const params = new URLSearchParams({ page, size, location: 1 });
  const response = await fetch(`${endpoints.stories}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getStoryDetail(id) {
  const token = getToken();
  const response = await fetch(endpoints.storyDetail(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function addStory({ description, photo, lat, lon }) {
  const token = getToken();
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  if (lat) formData.append('lat', lat);
  if (lon) formData.append('lon', lon);

  const response = await fetch(endpoints.stories, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return response.json();
}

export async function subscribePush(token, subscription) {
  const response = await fetch(endpoints.notificationsSubscribe, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: subscription.toJSON().keys,
    }),
  });
  return response.json();
}

export async function unsubscribePush(token, subscription) {
  const response = await fetch(endpoints.notificationsSubscribe, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
    }),
  });
  return response.json();
}
