import { obtenerReservas, guardarReservas, obtenerPacientesUnicos } from './Reservas.js';

function mostrarReservas() {
    const tabla = document.getElementById("tabla-reservas");
    if (!tabla) return;
    
    const lista = obtenerReservas()
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)); 

    tabla.innerHTML = lista.map(r => `
        <tr id="reserva-${r.id}">
            <td>${r.id}</td>
            <td>${r.pacienteNombre} (${r.documento})</td>
            <td>${new Date(r.fechaTurno).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</td>
            <td>${r.medicoNombre} (${r.especialidad})</td>
            <td>$${r.costo.toFixed(2)}</td>
            <td><span class="badge ${r.estado.includes('Confirmada') ? 'bg-success' : 'bg-danger'}">${r.estado}</span></td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="cancelarReserva(${r.id})"><i class="bi bi-x-circle"></i> Cancelar</button>
            </td>
        </tr>
    `).join("");
}

function cancelarReserva(id) {
    if (confirm("¿Estás seguro de **CANCELAR** esta reserva?")) {
        let lista = obtenerReservas();
        const index = lista.findIndex(r => r.id === id);
        if (index !== -1) {
            lista[index].estado = 'Cancelada por Admin';
            guardarReservas(lista);
            mostrarReservas(); 
        }
    }
}

function mostrarPacientes() {
    const tabla = document.getElementById("tabla-pacientes");
    if (!tabla) return;

    const pacientes = obtenerPacientesUnicos();

    tabla.innerHTML = pacientes.map(p => `
        <tr>
            <td>${p.nombre}</td>
            <td>${p.documento}</td>
            <td>${p.ultimaReserva}</td>
        </tr>
    `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
    const reservasTabTrigger = document.getElementById('reservas-tab');
    if (reservasTabTrigger) {
        if (reservasTabTrigger.classList.contains('active')) {
            mostrarReservas();
            mostrarPacientes();
        }
        reservasTabTrigger.addEventListener('shown.bs.tab', () => {
            mostrarReservas();
            mostrarPacientes();
        });
    }
});


window.cancelarReserva = cancelarReserva;