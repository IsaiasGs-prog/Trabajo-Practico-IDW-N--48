import { obtenerMedicos } from './Medico.js';
import { obtenerObrasSociales, obtenerObraSocialPorId } from './ObraSocial.js';
import { agregarReserva, obtenerReservas } from './Reservas.js';

const ALERTA_DIV = document.getElementById('alerta-reserva');
const COSTO_DIV = document.getElementById('costo-reserva');
const FORM = document.getElementById('form-reserva');

function cargarEspecialidades() {
    const medicos = obtenerMedicos();
    const especialidadesUnicas = [...new Set(medicos.map(m => m.especialidad))].sort();
    const select = document.getElementById('especialidad');
    
    select.innerHTML = '<option value="">Seleccione una Especialidad</option>';
    
    especialidadesUnicas.forEach(esp => {
        const option = document.createElement('option');
        option.value = esp;
        option.textContent = esp;
        select.appendChild(option);
    });
}

function cargarObrasSociales() {
    const obrasSociales = obtenerObrasSociales();
    const select = document.getElementById('obraSocialId');
    
    select.innerHTML = '<option value="">Seleccione su Obra Social</option>';
    
    obrasSociales.forEach(os => {
        const option = document.createElement('option');
        option.value = os.id;
        option.textContent = `${os.nombre} (Descuento: ${(os.descuento * 100).toFixed(0)}%)`; 
        select.appendChild(option);
    });
}

function cargarMedicosPorEspecialidad() {
    const especialidadSeleccionada = document.getElementById('especialidad').value;
    const medicos = obtenerMedicos();
    const medicosFiltrados = medicos.filter(m => m.especialidad === especialidadSeleccionada);
    const select = document.getElementById('medico');
    select.innerHTML = '<option value="">Seleccione un Médico</option>';
    select.disabled = true;
    COSTO_DIV.classList.add('d-none'); 

    if (especialidadSeleccionada) {
        select.disabled = false;
        medicosFiltrados.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = `${m.nombre} (Costo base: $${m.costoConsulta.toFixed(2)})`; 
            select.appendChild(option);
        });
    }
}

function calcularCosto() {
    const medicoId = document.getElementById('medico').value;
    const obraSocialId = document.getElementById('obraSocialId').value;
    const especialidad = document.getElementById('especialidad').value;

    if (!medicoId || !obraSocialId) {
        mostrarAlerta('Debe seleccionar un Médico y una Obra Social para calcular el costo.', 'alert-warning');
        COSTO_DIV.classList.add('d-none');
        return;
    }

    const medico = obtenerMedicos().find(m => m.id == medicoId);
    const obraSocial = obtenerObraSocialPorId(obraSocialId);

    if (!medico || !obraSocial) {
        mostrarAlerta('Error al obtener datos del médico o la obra social.', 'alert-danger');
        COSTO_DIV.classList.add('d-none');
        return;
    }

    const aceptaEspecialidad = obraSocial.acepta.includes("Todas") || obraSocial.acepta.includes(especialidad);

    let costoFinal = medico.costoConsulta;
    let mensajeCosto = '';
    
    if (aceptaEspecialidad) {
        costoFinal = medico.costoConsulta * (1 - obraSocial.descuento);
        const descuentoMonto = medico.costoConsulta * obraSocial.descuento;
        mensajeCosto = `Costo Final: $${costoFinal.toFixed(2)} (Descuento de $${descuentoMonto.toFixed(2)})`;
        COSTO_DIV.className = 'alert alert-success mb-0 w-100 text-center';
    } else {
        costoFinal = medico.costoConsulta;
        mensajeCosto = `Costo: $${costoFinal.toFixed(2)} (Su OS no cubre esta especialidad, no se aplica descuento)`;
        COSTO_DIV.className = 'alert alert-danger mb-0 w-100 text-center';
    }
    
    COSTO_DIV.innerHTML = mensajeCosto;
    COSTO_DIV.classList.remove('d-none');
    ocultarAlerta();
    
    document.getElementById('btn-reservar').dataset.costoFinal = costoFinal.toFixed(2);
}


function handleFormSubmit(e) {
    e.preventDefault();
    
    const medicoId = document.getElementById('medico').value;
    const obraSocialId = document.getElementById('obraSocialId').value;
    const costoFinal = document.getElementById('btn-reservar').dataset.costoFinal;
    
    if (!costoFinal || isNaN(parseFloat(costoFinal))) {
        mostrarAlerta('Por favor, haga clic en "Calcular Costo Final" antes de reservar.', 'alert-warning');
        return;
    }

    const medico = obtenerMedicos().find(m => m.id == medicoId);
    const obraSocial = obtenerObraSocialPorId(obraSocialId);
    
    if (!medico || !obraSocial) {
        mostrarAlerta('Error: No se pudo verificar la información del Médico o la Obra Social.', 'alert-danger');
        return;
    }

    const nuevaReserva = {
        pacienteNombre: document.getElementById('pacienteNombre').value.trim(),
        documento: document.getElementById('documento').value.trim(),
        fechaTurno: document.getElementById('fechaTurno').value,
        medicoId: parseInt(medicoId),
        medicoNombre: medico.nombre,
        especialidad: medico.especialidad, 
        obraSocialId: parseInt(obraSocialId),
        obraSocialNombre: obraSocial.nombre,
        costo: parseFloat(costoFinal) 
    };
    
    agregarReserva(nuevaReserva);

    mostrarAlerta('¡Reserva confirmada exitosamente! Consulte sus reservas con su documento.', 'alert-success');
    FORM.reset();
    COSTO_DIV.classList.add('d-none');
    document.getElementById('medico').disabled = true; 
}


function consultarReservas() {
    const documento = document.getElementById('consulta-documento').value.trim();
    const resultadosDiv = document.getElementById('resultados-consulta');
    resultadosDiv.innerHTML = '';
    
    if (!documento) {
        resultadosDiv.innerHTML = '<div class="alert alert-warning">Ingrese su documento para consultar.</div>';
        return;
    }

    const reservas = obtenerReservas();
    const reservasPaciente = reservas
        .filter(r => r.documento === documento)
        .sort((a, b) => new Date(b.fechaTurno) - new Date(a.fechaTurno)); 
    
    if (reservasPaciente.length === 0) {
        resultadosDiv.innerHTML = `<div class="alert alert-info">No se encontraron reservas para el documento ${documento}.</div>`;
        return;
    }

    const html = `
        <h4 class="mt-4">Turnos Encontrados (${reservasPaciente.length})</h4>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-primary">
                    <tr>
                        <th>Fecha/Hora Turno</th>
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
                            <td>${new Date(r.fechaTurno).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                            <td>${r.medicoNombre}</td>
                            <td>${r.especialidad}</td>
                            <td>${r.obraSocialNombre}</td>
                            <td>$${r.costo.toFixed(2)}</td>
                            <td><span class="badge ${r.estado.includes('Confirmada') ? 'bg-success' : 'bg-danger'}">${r.estado}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    resultadosDiv.innerHTML = html;
}

function mostrarAlerta(mensaje, tipoClase) {
    ALERTA_DIV.textContent = mensaje;
    ALERTA_DIV.className = `alert ${tipoClase} mt-3`;
    ALERTA_DIV.classList.remove('d-none');
}

function ocultarAlerta() {
    ALERTA_DIV.classList.add('d-none');
}


document.addEventListener('DOMContentLoaded', () => {
    if (FORM) {
        cargarEspecialidades();
        cargarObrasSociales();
        
        document.getElementById('especialidad').addEventListener('change', cargarMedicosPorEspecialidad);
        
        document.getElementById('medico').addEventListener('change', () => COSTO_DIV.classList.add('d-none'));
        document.getElementById('obraSocialId').addEventListener('change', () => COSTO_DIV.classList.add('d-none'));
        
        document.getElementById('btn-calcular').addEventListener('click', calcularCosto);
        document.getElementById('form-reserva').addEventListener('submit', handleFormSubmit);
        document.getElementById('btn-consultar-reservas').addEventListener('click', consultarReservas);
    }
});