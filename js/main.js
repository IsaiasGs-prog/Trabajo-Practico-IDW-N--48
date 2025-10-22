const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";
const AUTH_KEY = "isAuthenticated";

export function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.replace('index.html'); 
}

export function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
}

function handleLogin(e) {
    e.preventDefault();

    const user = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        window.location.href = 'admin.html';
    } else {
        alert('Credenciales incorrectas. Inténtalo de nuevo.');
        document.getElementById('pass').value = ''; 
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
                    <i class="bi bi-shield-lock-fill"></i> Admin
                </a>
            </li>
        `;
        const logoutItem = document.createElement('li');
        logoutItem.className = 'nav-item';
        logoutItem.innerHTML = `
            <button id="nav-logout-btn" class="btn btn-sm btn-danger m-2">
                <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
            </button>
        `;
        navItemsContainer.appendChild(logoutItem);
        document.getElementById('nav-logout-btn').addEventListener('click', logout);
    } else {
        navItemsContainer.innerHTML += `
            <li class="nav-item">
                <a class="nav-link text-primary" href="login.html">
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
    updateNavbar();
});