import { isAuthenticated } from './main.js';

const API_URL = 'https://dummyjson.com/users';

async function obtenerYMostrarUsuarios() {
    const tabla = document.getElementById("tabla-usuarios");
    if (!tabla) return;
    tabla.innerHTML = '<tr><td colspan="5" class="text-center p-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div> Cargando usuarios...</td></tr>';
    const token = isAuthenticated() ? sessionStorage.getItem("accessToken") : null;
    if (!token) {
        tabla.innerHTML = '<tr><td colspan="5" class="text-center p-4 alert alert-danger">Acceso denegado. Se requiere un token de sesión.</td></tr>';
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();

        if (!response.ok || data.users.length === 0) {
            tabla.innerHTML = `<tr><td colspan="5" class="text-center p-4 alert alert-warning">No se pudieron cargar los usuarios o la lista está vacía. Mensaje: ${data.message || 'Error desconocido'}</td></tr>`;
            return;
        }

        const html = data.users.map(u => {
            return `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.firstName} ${u.lastName}</td>
                    <td>${u.username}</td>
                    <td>${u.email}</td>
                    <td>${u.birthDate}</td>
                </tr>
            `;
        }).join('');
        
        tabla.innerHTML = html;

    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        tabla.innerHTML = `<tr><td colspan="5" class="text-center p-4 alert alert-danger">Error de conexión: ${error.message}</td></tr>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const usuariosTabTrigger = document.getElementById('usuarios-tab');
    if (usuariosTabTrigger) {
        usuariosTabTrigger.addEventListener('shown.bs.tab', obtenerYMostrarUsuarios);
    }
});