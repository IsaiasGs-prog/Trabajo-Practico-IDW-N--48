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
            const costo = parseFloat(m.costoConsulta) || 0;
            option.textContent = `${m.nombre} (Costo base: $${costo.toFixed(2)})`;
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

    const costoConsulta = parseFloat(medico.costoConsulta) || 0;
    let costoFinal = costoConsulta;
    let descuentoAplicado = 0;

    const aceptaEspecialidad =
        obraSocial.acepta.includes("Todas") || obraSocial.acepta.includes(medico.especialidad);

    if (aceptaEspecialidad && obraSocial.descuento > 0) {
        descuentoAplicado = costoConsulta * obraSocial.descuento;
        costoFinal = costoConsulta - descuentoAplicado;
        costoContainer.classList.remove('alert-danger');
        costoContainer.classList.add('alert-info');
    } else if (obraSocial.descuento > 0) {
        costoFinal = costoConsulta;
        costoContainer.classList.remove('alert-info');
        costoContainer.classList.add('alert-danger');
        costoContainer.innerHTML = `
            <i class="bi bi-exclamation-triangle"></i> 
            <strong>Costo final: $${costoFinal.toFixed(2)}</strong><br>
            <small>⚠️ El descuento de ${obraSocial.nombre} no aplica para ${medico.especialidad}.</small>
        `;
        costoContainer.classList.remove('d-none');
        return costoFinal;
    }

    costoContainer.classList.remove('d-none');
    costoContainer.innerHTML = `
        <div class="text-start">
            <p class="mb-2"><strong>📋 Detalle de Costos:</strong></p>
            <p class="mb-1">• Costo Base: <strong>$${costoConsulta.toFixed(2)}</strong></p>
            ${descuentoAplicado > 0 ? 
                `<p class="mb-1 text-success">• Descuento ${obraSocial.nombre} (${(obraSocial.descuento * 100).toFixed(0)}%): <strong>-$${descuentoAplicado.toFixed(2)}</strong></p>` 
                : '<p class="mb-1 text-muted">• Sin descuento aplicable</p>'}
            <hr class="my-2">
            <p class="mb-0 fs-5"><strong>💰 Costo Final: $${costoFinal.toFixed(2)}</strong></p>
        </div>
    `;

    if (costoDisplay) costoDisplay.textContent = costoFinal.toFixed(2);

    return costoFinal;
}

function imprimirTicket(reserva) {
    const fechaTurno = new Date(reserva.fechaTurno);
    const fechaEmision = new Date();
    
    const ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
    
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket de Reserva - Clínica IDW.SA</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    background: #f5f5f5;
                }
                .ticket {
                    max-width: 400px;
                    margin: 0 auto;
                    background: white;
                    padding: 30px;
                    border: 2px dashed #333;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #333;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .header h1 {
                    font-size: 24px;
                    margin-bottom: 5px;
                }
                .header p {
                    font-size: 12px;
                    color: #666;
                }
                .seccion {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px dashed #ccc;
                }
                .seccion:last-child {
                    border-bottom: none;
                }
                .seccion h2 {
                    font-size: 14px;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    color: #1976d2;
                }
                .fila {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 13px;
                }
                .fila .label {
                    font-weight: bold;
                    color: #333;
                }
                .fila .valor {
                    text-align: right;
                    color: #666;
                }
                .destacado {
                    background: #f0f0f0;
                    padding: 15px;
                    text-align: center;
                    border-radius: 5px;
                    margin: 15px 0;
                }
                .destacado .monto {
                    font-size: 28px;
                    font-weight: bold;
                    color: #1976d2;
                }
                .destacado .texto {
                    font-size: 12px;
                    color: #666;
                    margin-top: 5px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 2px solid #333;
                    font-size: 11px;
                    color: #999;
                }
                @media print {
                    body {
                        background: white;
                        padding: 0;
                    }
                    .ticket {
                        box-shadow: none;
                        max-width: 100%;
                    }
                    .no-print {
                        display: none;
                    }
                }
                .btn-imprimir {
                    display: block;
                    width: 100%;
                    padding: 15px;
                    margin-top: 20px;
                    background: #1976d2;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    font-family: Arial, sans-serif;
                }
                .btn-imprimir:hover {
                    background: #1565c0;
                }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="header">
                    <h1>CLÍNICA IDW.SA</h1>
                    <p>Monseñor Tavella 2000, Concordia</p>
                    <p>Tel: 345-234-1234</p>
                </div>
                
                <div class="seccion">
                    <h2>📋 Información del Paciente</h2>
                    <div class="fila">
                        <span class="label">Nombre:</span>
                        <span class="valor">${reserva.pacienteNombre}</span>
                    </div>
                    <div class="fila">
                        <span class="label">DNI:</span>
                        <span class="valor">${reserva.documento}</span>
                    </div>
                    <div class="fila">
                        <span class="label">Obra Social:</span>
                        <span class="valor">${reserva.obraSocialNombre}</span>
                    </div>
                </div>
                
                <div class="seccion">
                    <h2>🏥 Datos del Turno</h2>
                    <div class="fila">
                        <span class="label">Especialidad:</span>
                        <span class="valor">${reserva.especialidad}</span>
                    </div>
                    <div class="fila">
                        <span class="label">Médico:</span>
                        <span class="valor">${reserva.medicoNombre}</span>
                    </div>
                    <div class="fila">
                        <span class="label">Fecha:</span>
                        <span class="valor">${fechaTurno.toLocaleDateString('es-AR')}</span>
                    </div>
                    <div class="fila">
                        <span class="label">Hora:</span>
                        <span class="valor">${fechaTurno.toLocaleTimeString('es-AR', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                </div>
                
                <div class="destacado">
                    <div class="monto">$${reserva.costo.toFixed(2)}</div>
                    <div class="texto">COSTO TOTAL DE LA CONSULTA</div>
                </div>
                
                <div class="seccion">
                    <h2>ℹ️ Información Importante</h2>
                    <div class="fila">
                        <span class="label">Nº de Reserva:</span>
                        <span class="valor">#${reserva.id}</span>
                    </div>
                    <div class="fila">
                        <span class="label">Emisión:</span>
                        <span class="valor">${fechaEmision.toLocaleString('es-AR')}</span>
                    </div>
                    <div class="fila">
                        <span class="label">Estado:</span>
                        <span class="valor">${reserva.estado}</span>
                    </div>
                </div>
                
                <div class="footer">
                    <p>⚠️ Presentarse 15 minutos antes de la hora del turno</p>
                    <p>Traer DNI y credencial de obra social</p>
                    <p style="margin-top: 10px;">───────────────────────────────</p>
                    <p>© 2025 Clínica IDW.SA - Todos los derechos reservados</p>
                </div>
                
                <button class="btn-imprimir no-print" onclick="window.print()">
                    🖨️ IMPRIMIR TICKET
                </button>
            </div>
        </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
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

    const reservaGuardada = agregarReserva(nuevaReserva);
    
    if (confirm(`¡Reserva confirmada exitosamente! ✅

Paciente: ${nuevaReserva.pacienteNombre}
Médico: ${nuevaReserva.medicoNombre}
Fecha: ${new Date(nuevaReserva.fechaTurno).toLocaleString('es-AR')}
Costo Total: $${costoFinal.toFixed(2)}

¿Desea imprimir el ticket de la reserva?`)) {
        imprimirTicket(reservaGuardada);
    }
    
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
                        <th>Acciones</th>
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
                            <td><span class="badge ${r.estado === 'Confirmada' ? 'bg-success' : 'bg-danger'}">${r.estado}</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="reimprimirTicket(${r.id})">
                                    <i class="bi bi-printer"></i> Reimprimir
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    resultadosDiv.innerHTML = html;
}

window.reimprimirTicket = function(reservaId) {
    const reserva = obtenerReservas().find(r => r.id === reservaId);
    if (reserva) {
        imprimirTicket(reserva);
    }
};

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


