import { 
    obtenerObrasSociales, 
    guardarObrasSociales, 
    OBRAS_SOCIALES_INICIALES 
} from './ObraSocial.js'; 

const DEFAULT_ACEPTA = ["Medicina General"];

function mostrarObrasSociales() {
    const tabla = document.getElementById("tabla-obras-sociales");
    if (!tabla) return;
    
    const lista = obtenerObrasSociales();

    tabla.innerHTML = lista.map(os => `
        <tr>
            <td>${os.id}</td>
            <td>${os.nombre}</td>
            <td>${(os.descuento * 100).toFixed(0)}%</td>
            <td>${os.acepta.join(', ')}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="cargarOSParaEdicion(${os.id})"><i class="bi bi-pencil"></i> Editar</button>
                <button class="btn btn-danger btn-sm" onclick="borrarOS(${os.id})"><i class="bi bi-trash"></i> Eliminar</button>
            </td>
        </tr>
    `).join("");
}

function agregarOActualizarOS(osData) {
    let lista = obtenerObrasSociales();
    osData.nombre = osData.nombre.trim();
    osData.descuento = parseFloat(osData.descuento); 
    osData.acepta = osData.acepta
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    
    const index = lista.findIndex(os => os.id === osData.id);

    if (index !== -1) {
        lista[index].nombre = osData.nombre;
        lista[index].descuento = osData.descuento;
        lista[index].acepta = osData.acepta;
        alert(`Obra Social ${osData.nombre} modificada exitosamente.`);
    } else {
        const newId = lista.length > 0 ? Math.max(...lista.map(os => os.id)) + 1 : 101;
        lista.push({ 
            id: newId, 
            nombre: osData.nombre, 
            descuento: osData.descuento, 
            acepta: osData.acepta.length > 0 ? osData.acepta : DEFAULT_ACEPTA
        });
        alert(`Obra Social ${osData.nombre} agregada exitosamente.`);
    }

    guardarObrasSociales(lista);
    mostrarObrasSociales();
}

function eliminarOS(id) {
    if (confirm("¿Estás seguro de eliminar esta Obra Social?")) {
        let lista = obtenerObrasSociales();
        lista = lista.filter(os => os.id !== id);
        guardarObrasSociales(lista);
        mostrarObrasSociales();
    }
}

function cargarOSParaEdicion(id) {
    const os = obtenerObrasSociales().find(os => os.id === id);
    if (!os) return;
    document.getElementById('os-id').value = os.id;
    document.getElementById('os-nombre').value = os.nombre;
    document.getElementById('os-descuento').value = (os.descuento * 100).toFixed(0); 
    document.getElementById('os-acepta').value = os.acepta.join(', ');
    document.getElementById('btn-os-submit').textContent = "Guardar Cambios";
    const triggerEl = document.querySelector('#obras-sociales-tab');
    if (triggerEl) {
        new bootstrap.Tab(triggerEl).show();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("tabla-obras-sociales")) {
        mostrarObrasSociales();
        const form = document.getElementById("form-obra-social");
        const submitButton = document.getElementById('btn-os-submit');
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                
                const osId = document.getElementById('os-id').value;
                
                const osData = {
                    id: osId ? parseInt(osId) : null,
                    nombre: form['os-nombre'].value,
                    descuento: parseFloat(form['os-descuento'].value) / 100, 
                    acepta: form['os-acepta'].value 
                };
                
                agregarOActualizarOS(osData);
                form.reset();
                document.getElementById('os-id').value = "";
                submitButton.textContent = "Agregar";
            });
        }
    }
});


window.borrarOS = eliminarOS;
window.cargarOSParaEdicion = cargarOSParaEdicion;