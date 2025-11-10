export function obtenerMedicos() {
    const key = 'medicos';
    try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : null;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
        console.warn('Error parseando medicos en localStorage, se usarán valores por defecto.', e);
    }

    const medicosPorDefecto = [
        { id: 1, nombre: 'Dr. Juan Pérez', especialidad: 'Medicina General', costoConsulta: 2500, imagen: 'https://ar.pinterest.com/pin/1042231538777460903/' },
        { id: 2, nombre: 'Dra. Ana Gómez', especialidad: 'Pediatría', costoConsulta: 3000, imagen: 'https://ar.pinterest.com/pin/1042231538777460939/' },
        { id: 3, nombre: 'Dr. Carlos Ruiz', especialidad: 'Cardiología', costoConsulta: 4500, imagen: 'https://ar.pinterest.com/pin/1042231538777461135/' },
        { id: 4, nombre: 'Dra. Angela Hamilton', especialidad: 'Dermatología', costoConsulta: 3800, imagen: 'https://ar.pinterest.com/pin/1042231538777460952/' }
    ];

    localStorage.setItem(key, JSON.stringify(medicosPorDefecto));
    return medicosPorDefecto;
}

export function guardarMedicos(medicos) {
    try {
        localStorage.setItem('medicos', JSON.stringify(medicos || []));
    } catch (e) {
        console.error('No se pudo guardar medicos en localStorage', e);
    }
}

function formatoCosto(medico) {
    if (!medico || medico.costoConsulta === null || medico.costoConsulta === undefined || medico.costoConsulta === '') {
        return 'Consultar';
    }
    const costo = medico.costoConsulta;
    if (typeof costo === 'number' && !isNaN(costo)) {
        return `$ ${costo.toLocaleString('es-AR')}`;
    }
    return String(costo);
}

function templateCardMedico(m) {
    const img = m.imagen && m.imagen.trim() ? m.imagen : 'img/placeholder.png';
    const nombre = m.nombre || 'Sin nombre';
    const especialidad = m.especialidad || '';
    const costoTexto = formatoCosto(m);

    return `
    <div class="col-sm-6 col-md-4">
        <div class="card h-100 shadow-sm">
            <img src="${img}" class="card-img-top" alt="${nombre}">
            <div class="card-body">
                <h5 class="card-title">${nombre}</h5>
                <p class="card-text text-secondary mb-2">${especialidad}</p>
                <p class="card-text"><strong>Costo:</strong> ${costoTexto}</p>
            </div>
        </div>
    </div>
    `;
}

function mostrarMedicos() {
  const tabla = document.getElementById("tabla-medicos");
  if (!tabla) return; 

  const lista = obtenerMedicos();

  tabla.innerHTML = lista.map(m => `
    <tr>
      <td>${m.nombre}</td>
      <td>${m.especialidad}</td>
      <td>${m.telefono}</td>
      <td>${m.obraSocial}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editar(${m.id})"><i class="bi bi-pencil"></i> Editar</button>
        <button class="btn btn-danger btn-sm" onclick="borrar(${m.id})"><i class="bi bi-trash"></i> Eliminar</button>
      </td>
    </tr>
  `).join("");
}


export function cargarCatalogoProfesionales() {
    const cont = document.getElementById('catalogo-profesionales');
    if (!cont) return;
    const medicos = obtenerMedicos();
    cont.innerHTML = '';
    medicos.forEach(m => cont.insertAdjacentHTML('beforeend', templateCardMedico(m)));
}

export function cargarDestacadosIndex(limit = 3) {
    const cont = document.getElementById('destacados-index');
    if (!cont) return;
    const medicos = obtenerMedicos();
    cont.innerHTML = '';
    medicos.slice(0, limit).forEach(m => cont.insertAdjacentHTML('beforeend', templateCardMedico(m)));
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Medico.js cargado");
    
    mostrarMedicos();
    cargarCatalogoProfesionales(); 
    cargarDestacadosIndex(); 

    window.addEventListener('storage', (e) => {
        if (e.key === 'medicos') {
            console.log("🔄 Storage actualizado, recargando datos");
            cargarCatalogoProfesionales();
            cargarDestacadosIndex();
            mostrarMedicos();
        }
    });

    window.addEventListener('medicosActualizados', () => {
        console.log("🔄 Médicos actualizados, recargando datos");
        cargarCatalogoProfesionales();
        cargarDestacadosIndex();
        mostrarMedicos();
    });

    const form = document.getElementById("form-medico");
    
    if (form) { 
        const submitButton = document.getElementById("btn-submit");
        const medicoIdInput = document.getElementById("medico-id");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const datosMedico = {
                nombre: form.nombre.value,
                especialidad: form.especialidad.value,
                telefono: form.telefono.value,
                obraSocial: form.obraSocial.value,
                costoConsulta: parseFloat(form.costoConsulta.value) || 0,
                img: form.img.value 
            };

            const id = medicoIdInput.value;

            if (id) {
                editarMedico(parseInt(id), datosMedico);
                alert(`Médico ${datosMedico.nombre} modificado exitosamente.`);
            } else {
                agregarMedico(datosMedico);
                alert(`Médico ${datosMedico.nombre} agregado exitosamente.`);
            }
            
            form.reset();
            medicoIdInput.value = "";
            submitButton.textContent = "Agregar";
        });
    }
});

window.borrar = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este médico?')) {
        eliminarMedico(id);
    }
};

window.editar = (id) => {
    const medico = obtenerMedicoPorId(id);
    if (!medico) {
        alert('Médico no encontrado');
        return;
    }

    document.getElementById("medico-id").value = medico.id;
    document.getElementById("nombre").value = medico.nombre;
    document.getElementById("especialidad").value = medico.especialidad;
    document.getElementById("telefono").value = medico.telefono;
    document.getElementById("obraSocial").value = medico.obraSocial;
    document.getElementById("costoConsulta").value = medico.costoConsulta || 0;
    
    const imgInput = document.getElementById("img");
    imgInput.value = medico.img === DEFAULT_IMG_URL ? '' : medico.img;

    document.getElementById("btn-submit").textContent = "Guardar Cambios";
    const form = document.getElementById("form-medico");
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
    }
};

function dispatchMedicosActualizados() {
  window.dispatchEvent(new Event('medicosActualizados'));
  window.dispatchEvent(new Event('storage'));
}