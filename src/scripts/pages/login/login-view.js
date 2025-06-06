import { getLoadingTemplate } from '../../utils/index.js';

export default class LoginView {
  getTemplate() {
    return `
      <section class="auth-section">
        <div class="auth-card">
          <h1 class="auth-title">Login</h1>
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" required autocomplete="username" />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" required autocomplete="current-password" />
            </div>
            <button type="submit" class="auth-btn">Login</button>
          </form>
          <p id="login-message" class="auth-message" aria-live="polite"></p>
          <p class="auth-link">Don't have an account? <a href="#/register">Register</a></p>
        </div>
      </section>
    `;
  }

  showLoading() {
    document.getElementById('login-message').innerHTML = getLoadingTemplate('Processing...');
  }

  hideLoading() {
    document.getElementById('login-message').innerHTML = '';
  }

  bindLogin(handler, onSuccess) {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const result = await handler({ email, password });
      if (result.success && typeof onSuccess === 'function') {
        onSuccess();
      }
    });
  }

  showMessage(msg) {
    document.getElementById('login-message').textContent = msg;
  }
}