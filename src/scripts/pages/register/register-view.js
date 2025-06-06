import { getLoadingTemplate } from '../../utils/index.js';

export default class RegisterView {
  getTemplate() {
    return `
      <section class="auth-section">
        <div class="auth-card">
          <h1 class="auth-title">Register</h1>
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input id="name" name="name" type="text" required autocomplete="name" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" required autocomplete="username" />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" required minlength="8" autocomplete="new-password" />
            </div>
            <button type="submit" class="auth-btn">Register</button>
          </form>
          <p id="register-message" class="auth-message" aria-live="polite"></p>
          <p class="auth-link">Already have an account? <a href="#/login">Login</a></p>
        </div>
      </section>
    `;
  }

  showLoading() {
    document.getElementById('register-message').innerHTML = getLoadingTemplate('Processing...');
  }

  hideLoading() {
    document.getElementById('register-message').innerHTML = '';
  }

  bindRegister(handler, onSuccess) {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const result = await handler({ name, email, password });
      if (result.success && typeof onSuccess === 'function') {
        onSuccess();
      }
    });
  }

  showMessage(msg) {
    document.getElementById('register-message').textContent = msg;
  }
}