const AUTH_KEY = "accessToken";

export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  window.location.replace('index.html');
}

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) !== null;
}

function toggleLoading(submitButton, isLoading) {
  const spinner = submitButton.querySelector('#login-spinner');
  const buttonText = submitButton.querySelector('#button-text');
  
  if (isLoading) {
    submitButton.disabled = true;
    buttonText.classList.add('d-none');
    spinner.classList.remove('d-none');
  } else {
    submitButton.disabled = false;
    buttonText.classList.remove('d-none');
    spinner.classList.add('d-none');
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const user = document.getElementById('user').value.trim();
  const pass = document.getElementById('pass').value.trim();
  const errorDiv = document.getElementById('login-error');
  const submitButton = document.getElementById('login-button');

  errorDiv.classList.add('d-none');
  errorDiv.textContent = '';

  toggleLoading(submitButton, true);

  try {
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
      if (data.message) {
        errorDiv.textContent = `Error de inicio de sesión: ${data.message}`;
      } else {
        errorDiv.textContent = 'Error de inicio de sesión. Credenciales incorrectas.';
      }
      errorDiv.classList.remove('d-none');
      return;
    }

    sessionStorage.setItem(AUTH_KEY, data.token);
    window.location.replace('admin.html'); 

  } catch (error) {
    console.error("Error en la solicitud de login:", error);
    errorDiv.textContent = 'Ocurrió un error de conexión. Intente más tarde.';
    errorDiv.classList.remove('d-none');
  } finally {
    toggleLoading(submitButton, false);
  }
}

function updateNavbar() {
  const navItemsContainer = document.getElementById('navbar-dynamic-items');
  if (!navItemsContainer) return;

  let dynamicItems = navItemsContainer.querySelectorAll('.dynamic-nav-item');
  dynamicItems.forEach(item => item.remove());

  if (isAuthenticated()) {
    navItemsContainer.insertAdjacentHTML('beforeend', `
      <li class="nav-item dynamic-nav-item">
        <a class="nav-link text-success fw-bold" href="admin.html">
          <i class="bi bi-shield-lock-fill"></i> Panel Admin
        </a>
      </li>
    `);

    const logoutItem = document.createElement('li');
    logoutItem.className = 'nav-item dynamic-nav-item';
    logoutItem.innerHTML = `
      <button id="nav-logout-btn" class="btn btn-sm btn-danger mt-2 mt-md-0 ms-md-2">
        <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
      </button>
    `;
    navItemsContainer.appendChild(logoutItem);

    document.getElementById('nav-logout-btn').addEventListener('click', logout);
  } else {
    navItemsContainer.insertAdjacentHTML('beforeend', `
      <li class="nav-item dynamic-nav-item">
        <a class="nav-link text-primary fw-bold" href="login.html">
          <i class="bi bi-person-circle"></i> Login
        </a>
      </li>
    `);
  }
}



document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    updateNavbar();
});
