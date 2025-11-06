const RESERVAS_KEY = "reservas";

if (!localStorage.getItem(RESERVAS_KEY)) {
    localStorage.setItem(RESERVAS_KEY, JSON.stringify([]));
}

export function obtenerReservas() {
    return JSON.parse(localStorage.getItem(RESERVAS_KEY)) || [];
}

function guardarReservas(lista) {
    localStorage.setItem(RESERVAS_KEY, JSON.stringify(lista));
}

/**
 * @param {object} reserva 
 */
export function agregarReserva(reserva) {
    const lista = obtenerReservas();
    reserva.id = Date.now(); 
    reserva.fechaCreacion = new Date().toLocaleString();
    reserva.estado = 'Confirmada'; 
    lista.push(reserva);
    guardarReservas(lista);
    return reserva;
}


export function obtenerPacientesUnicos() {
    const reservas = obtenerReservas();
    const pacientesMap = new Map();
    
    reservas.forEach(r => {
        if (!pacientesMap.has(r.documento)) {
            pacientesMap.set(r.documento, {
                nombre: r.pacienteNombre,
                documento: r.documento,
                ultimaReserva: r.fechaCreacion
            });
        }
    });

    return Array.from(pacientesMap.values());
}