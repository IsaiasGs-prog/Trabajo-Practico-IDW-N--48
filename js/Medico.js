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
        { id: 1, nombre: 'Dr. Juan Pérez', especialidad: 'Medicina General', costoConsulta: 22500, imagen: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', telefono: '', obraSocial: '' },
        { id: 2, nombre: 'Dra. Ana Gómez', especialidad: 'Pediatría', costoConsulta: 33000, imagen: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', telefono: '', obraSocial: '' },
        { id: 3, nombre: 'Dr. Carlos Ruiz', especialidad: 'Cardiología', costoConsulta: 44500, imagen: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400', telefono: '', obraSocial: '' },
        { id: 4, nombre: 'Dra. Angela Hamilton', especialidad: 'Dermatología', costoConsulta: 53800, imagen: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400', telefono: '', obraSocial: '' }
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

export function agregarMedico(datosMedico) {
    const medicos = obtenerMedicos();
    const nuevoId = medicos.length > 0 ? Math.max(...medicos.map(m => m.id)) + 1 : 1;
    
    const nuevoMedico = {
        id: nuevoId,
        nombre: datosMedico.nombre,
        especialidad: datosMedico.especialidad,
        telefono: datosMedico.telefono || '',
        obraSocial: datosMedico.obraSocial || '',
        costoConsulta: datosMedico.costoConsulta || 0,
        imagen: datosMedico.img || ''
    };
    
    medicos.push(nuevoMedico);
    guardarMedicos(medicos);
    dispatchMedicosActualizados();
    mostrarMedicos();
}

export function editarMedico(id, datosMedico) {
    const medicos = obtenerMedicos();
    const index = medicos.findIndex(m => m.id === id);
    
    if (index !== -1) {
        medicos[index] = {
            ...medicos[index],
            nombre: datosMedico.nombre,
            especialidad: datosMedico.especialidad,
            telefono: datosMedico.telefono || '',
            obraSocial: datosMedico.obraSocial || '',
            costoConsulta: datosMedico.costoConsulta || 0,
            imagen: datosMedico.img || medicos[index].imagen
        };
        
        guardarMedicos(medicos);
        dispatchMedicosActualizados();
        mostrarMedicos();
    }
}

export function eliminarMedico(id) {
    const medicos = obtenerMedicos();
    const medicosFiltrados = medicos.filter(m => m.id !== id);
    guardarMedicos(medicosFiltrados);
    dispatchMedicosActualizados();
    mostrarMedicos();
    alert('Médico eliminado exitosamente.');
}

function formatoCosto(medico) {
    if (!medico || medico.costoConsulta === null || medico.costoConsulta === undefined || medico.costoConsulta === '') {
        return '100.000';
    }
    const costo = medico.costoConsulta;
    if (typeof costo === 'number' && !isNaN(costo)) {
        return `$ ${costo.toLocaleString('es-AR')}`;
    }
    return String(costo);
}

function templateCardMedico(m) {
    const img = m.imagen && m.imagen.trim() ? m.imagen : 'img/doctor1.jpeg';
    const nombre = m.nombre || 'Sin nombre';
    const especialidad = m.especialidad || '';
    const costoTexto = formatoCosto(m);
    const obraSocial = m.obraSocial && m.obraSocial.trim() ? m.obraSocial : 'No especificada';

    return `
    <div class="col-sm-6 col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
            <img src="${img}" class="card-img-top" alt="${nombre}" 
                 style="height: 250px; object-fit: cover;"
                 onerror="this.src='img/doctor1.jpeg'">
            <div class="card-body">
                <h5 class="card-title">${nombre}</h5>
                <p class="card-text text-secondary mb-2">${especialidad}</p>
                <p class="card-text mb-1"><strong>Costo:</strong> ${costoTexto}</p>
                <p class="card-text"><strong>Obra Social:</strong> ${obraSocial}</p>
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
            <td>$ ${m.costoConsulta?.toLocaleString('es-AR') || '0'}</td>
            <td>${m.obraSocial || '-'}</td>
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
    
    // Asegurarse de que el contenedor tenga las clases de Bootstrap
    if (!cont.classList.contains('row')) {
        cont.classList.add('row', 'g-4');
    }
    
    cont.innerHTML = '';
    medicos.forEach(m => cont.insertAdjacentHTML('beforeend', templateCardMedico(m)));
}

export function cargarDestacadosIndex(limit = 3) {
    const cont = document.getElementById('destacados-index');
    if (!cont) return;
    const medicos = obtenerMedicos();
    
    // Asegurarse de que el contenedor tenga las clases de Bootstrap
    if (!cont.classList.contains('row')) {
        cont.classList.add('row', 'g-4');
    }
    
    cont.innerHTML = '';
    medicos.slice(0, limit).forEach(m => cont.insertAdjacentHTML('beforeend', templateCardMedico(m)));
}

function obtenerMedicoPorId(id) {
    const medicos = obtenerMedicos();
    return medicos.find(m => m.id === id);
}

function dispatchMedicosActualizados() {
    window.dispatchEvent(new Event('medicosActualizados'));
    window.dispatchEvent(new Event('storage'));
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
                submitButton.textContent = "Agregar";
            } else {
                agregarMedico(datosMedico);
                alert(`Médico ${datosMedico.nombre} agregado exitosamente.`);
            }

            form.reset();
            medicoIdInput.value = "";
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
    document.getElementById("telefono").value = medico.telefono || '';
    document.getElementById("obraSocial").value = medico.obraSocial || '';
    document.getElementById("costoConsulta").value = medico.costoConsulta || 0;

    const imgInput = document.getElementById("img");
    imgInput.value = medico.imagen || '';

    document.getElementById("btn-submit").textContent = "Guardar Cambios";
    const form = document.getElementById("form-medico");
    if (form) form.scrollIntoView({ behavior: 'smooth' });
};
