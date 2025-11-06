import { obtenerMedicos } from './Medico.js';
import { obtenerObrasSociales } from './ObraSocial.js';
import { agregarReserva, obtenerReservas } from './Reservas.js';

function cargarEspecialidades() {
    const medicos = obtenerMedicos();
    const especialidadesUnicas = [...new Set(medicos.map(m => m.especialidad))];
    const select = document.getElementById('especialidad');
    especialidadesUnicas.forEach(esp => {
        const option = document.createElement('option');
        option.value = esp;
        option.textContent = esp;
        select.appendChild(option);
    });
}

function cargarMedicosPorEspecialidad() {
    const especialidadSeleccionada = document.getElementById('especialidad').value;
    const medicos = obtenerMedicos();
    const medicosFiltrados = medicos.filter(m => m.especialidad === especialidadSeleccionada);
    const select = document.getElementById('medico');
    select.innerHTML = '<option value="">Seleccione un Médico</option>';

    if (especialidadSeleccionada) {
        select.disabled = false;
        medicosFiltrados.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = `${m.nombre} (Costo base: $${m.costoConsulta.toFixed(2)})`; 
            select.appendChild(option);
        });
    } else {
        select.disabled = true;
    }
    document.getElementById('costo-reserva').classList.add('d-none');
}

function cargarObrasSociales() {
    const obrasSociales = obtenerObrasSociales();
    const select = document.getElementById('obraSocialId');
    obrasSociales.forEach(os => {
        const option = document.createElement('option');
        option.value = os.id;
        option.textContent = os.nombre;
        select.appendChild(option);
    });
}

function calcularCosto() {
    const medicoId = document.getElementById('medico').value;
    const obraSocialId = document.getElementById('obraSocialId').value;
    const costoDisplay = document.querySelector('#costo-reserva span');
    const costoContainer = document.getElementById('costo-reserva');

    if (!medicoId || !obraSocialId) {
        costoContainer.classList.add('d-none');
        return 0;
    }
    
    const medico = obtenerMedicos().find(m => m.id === parseInt(medicoId));
    const obraSocial = obtenerObrasSociales().find(os => os.id === parseInt(obraSocialId));

    if (!medico || !obraSocial) {
        costoContainer.classList.add('d-none');
        return 0;
    }

    let costoFinal = medico.costoConsulta;
    let descuentoAplicado = 0;

    const aceptaEspecialidad = obraSocial.acepta.includes("Todas") || obraSocial.acepta.includes(medico.especialidad);

    if (aceptaEspecialidad && obraSocial.descuento > 0) {
        descuentoAplicado = medico.costoConsulta * obraSocial.descuento;
        costoFinal = medico.costoConsulta - descuentoAplicado;
        costoContainer.classList.remove('alert-danger');
        costoContainer.classList.add('alert-info');
    } else if (obraSocial.descuento > 0) {
        costoFinal = medico.costoConsulta;
        costoContainer.classList.remove('alert-info');
        costoContainer.classList.add('alert-danger');
        costoContainer.innerHTML = `<i class="bi bi-currency-dollar"></i> Costo final: <strong>$${costoFinal.toFixed(2)}</strong>. <br><small>El descuento de ${obraSocial.nombre} no aplica para ${medico.especialidad}.</small>`;
        return costoFinal;
    }

    costoDisplay.textContent = costoFinal.toFixed(2);
    costoContainer.classList.remove('d-none');
    costoContainer.innerHTML = `
        <i class="bi bi-currency-dollar"></i> Costo Base: $${medico.costoConsulta.toFixed(2)} <br>
        ${descuentoAplicado > 0 ? `Descuento ${obraSocial.nombre} (${(obraSocial.descuento * 100).toFixed(0)}%): -$${descuentoAplicado.toFixed(2)}<br>` : ''}
        Costo Final: <strong>$${costoFinal.toFixed(2)}</strong>
    `;

    return costoFinal;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const costoFinal = calcularCosto();

    if (costoFinal === 0) {
        alert("Por favor, complete todos los campos de selección y presione 'Calcular Costo' primero.");
        return;
    }
    
    const medicoId = document.getElementById('medico').value;
    const medico = obtenerMedicos().find(m => m.id === parseInt(medicoId));

    const nuevaReserva = {
        pacienteNombre: document.getElementById('pacienteNombre').value.trim(),
        documento: document.getElementById('documento').value.trim(),
        especialidad: document.getElementById('especialidad').value,
        medicoId: parseInt(medicoId),
        medicoNombre: medico.nombre,
        obraSocialId: parseInt(document.getElementById('obraSocialId').value),
        obraSocialNombre: obtenerObrasSociales().find(os => os.id === parseInt(document.getElementById('obraSocialId').value)).nombre,
        fechaTurno: document.getElementById('fecha').value,
        costo: costoFinal
    };

    agregarReserva(nuevaReserva);
    alert(`¡Reserva confirmada! \nCosto Total: $${costoFinal.toFixed(2)} \nSe le notificará a ${nuevaReserva.pacienteNombre}.`);
    e.target.reset();
    document.getElementById('costo-reserva').classList.add('d-none');
    cargarMedicosPorEspecialidad();
}

function consultarReservas() {
    const dni = document.getElementById('consultaDNI').value.trim();
    const resultadosDiv = document.getElementById('resultados-consulta');

    if (!dni) {
        resultadosDiv.innerHTML = '<div class="alert alert-warning">Ingrese un DNI para consultar.</div>';
        return;
    }

    const reservasPaciente = obtenerReservas().filter(r => r.documento === dni);

    if (reservasPaciente.length === 0) {
        resultadosDiv.innerHTML = '<div class="alert alert-info">No se encontraron reservas para ese DNI.</div>';
        return;
    }

    const html = `
        <h5 class="mt-3">Reservas Encontradas para DNI: ${dni}</h5>
        <div class="table-responsive">
            <table class="table table-sm table-bordered table-striped">
                <thead class="table-primary">
                    <tr>
                        <th>Fecha y Hora</th>
                        <th>Médico</th>
                        <th>Especialidad</th>
                        <th>Obra Social</th>
                        <th>Costo Final</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservasPaciente.map(r => `
                        <tr>
                            <td>${new Date(r.fechaTurno).toLocaleString()}</td>
                            <td>${r.medicoNombre}</td>
                            <td>${r.especialidad}</td>
                            <td>${r.obraSocialNombre}</td>
                            <td>$${r.costo.toFixed(2)}</td>
                            <td><span class="badge bg-success">${r.estado}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    resultadosDiv.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    cargarEspecialidades();
    cargarObrasSociales();
    document.getElementById('especialidad').addEventListener('change', cargarMedicosPorEspecialidad);
    document.getElementById('medico').addEventListener('change', () => document.getElementById('costo-reserva').classList.add('d-none'));
    document.getElementById('obraSocialId').addEventListener('change', () => document.getElementById('costo-reserva').classList.add('d-none'));
    document.getElementById('btn-calcular').addEventListener('click', calcularCosto);
    document.getElementById('form-reserva').addEventListener('submit', handleFormSubmit);
    document.getElementById('btn-consultar-reservas').addEventListener('click', consultarReservas);
});