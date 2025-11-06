const AUTH_KEY = "accessToken";

export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.replace('index.html');
}

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) !== null;
}

async function handleLogin(e) {
  e.preventDefault();

  const user = document.getElementById('user').value.trim();
  const pass = document.getElementById('pass').value.trim();
  const errorDiv = document.getElementById('login-error');
  const submitButton = document.getElementById('login-button');
  const spinner = submitButton.querySelector('#login-spinner');
  const buttonText = submitButton.querySelector('#button-text');

  errorDiv.classList.add('d-none');
  errorDiv.textContent = '';

  submitButton.disabled = true;
  buttonText.classList.add('d-none');
  spinner.classList.remove('d-none');

  try {
    console.log("Enviando login con:", { username: user, password: pass });

    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Credenciales incorrectas');
    }

    sessionStorage.setItem(AUTH_KEY, data.token);
    window.location.href = 'admin.html';

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    errorDiv.textContent = `⚠️ ${error.message}. Intenta nuevamente.`;
    errorDiv.classList.remove('d-none');
    document.getElementById('pass').value = '';
  } finally {
    submitButton.disabled = false;
    buttonText.classList.remove('d-none');
    spinner.classList.add('d-none');
  }
}

function updateNavbar() {
  const navItemsContainer = document.getElementById('navbar-dynamic-items');
  if (!navItemsContainer) return;

  navItemsContainer.innerHTML = '';

  if (isAuthenticated()) {
    navItemsContainer.innerHTML += `
      <li class="nav-item">
        <a class="nav-link text-success fw-bold" href="admin.html">
          <i class="bi bi-shield-lock-fill"></i> Panel Admin
        </a>
      </li>
    `;

    const logoutItem = document.createElement('li');
    logoutItem.className = 'nav-item';
    logoutItem.innerHTML = `
      <button id="nav-logout-btn" class="btn btn-sm btn-danger mt-2 mt-md-0 ms-md-2">
        <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
      </button>
    `;
    navItemsContainer.appendChild(logoutItem);
    document.getElementById('nav-logout-btn').addEventListener('click', logout);
  } else {
    navItemsContainer.innerHTML += `
      <li class="nav-item">
        <a class="nav-link text-primary fw-bold" href="login.html">
          <i class="bi bi-person-circle"></i> Login
        </a>
      </li>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (document.getElementById('navbar-dynamic-items')) {
    updateNavbar();
  }
});
