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
    const index = lista.findIndex(os => os.id === osData.id);
    osData.nombre = osData.nombre.trim();
    osData.descuento = parseFloat(osData.descuento) || 0;
    osData.acepta = osData.acepta.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (osData.acepta.length === 0) {
        osData.acepta = DEFAULT_ACEPTA;
    }
    
    if (index !== -1) {
        lista[index] = osData;
    } else {
        osData.id = Date.now(); 
        lista.push(osData);
    }
    
    guardarObrasSociales(lista);
    mostrarObrasSociales();
}

function eliminarOS(id) {
    if (confirm("¿Estás seguro de eliminar esta Obra Social?")) {
        const lista = obtenerObrasSociales().filter(os => os.id !== id);
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
}


document.addEventListener("DOMContentLoaded", () => {
    mostrarObrasSociales();

    const form = document.getElementById("form-obra-social");
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
            document.getElementById('os-id').value = '';
            document.getElementById('btn-os-submit').textContent = "Agregar Obra Social";
        });
    }
});

window.borrarOS = eliminarOS;
window.cargarOSParaEdicion = cargarOSParaEdicion;