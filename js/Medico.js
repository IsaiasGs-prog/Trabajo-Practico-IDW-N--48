const DEFAULT_IMG_URL = "https://i.pinimg.com/736x/2e/7f/f9/2e7ff930420f590aa6d785aec296ac3b.jpg";

export const DOCTORES_INICIALES = [
  { id: 1, nombre: "Dr. Juan Pérez", especialidad: "Cardiología", telefono: "345-234-5678", obraSocial: "Andar", costoConsulta: 75000, img: "https://i.pinimg.com/736x/2e/7f/f9/2e7ff930420f590aa6d785aec296ac3b.jpg" },
  { id: 2, nombre: "Dra. Ana Gómez", especialidad: "Ginecología", telefono: "345-234-5679", obraSocial: "Construir Salud", costoConsulta: 68000, img: "https://i.pinimg.com/736x/41/30/b4/4130b4047f433315bf1afcdb4c27a206.jpg" },
  { id: 3, nombre: "Dra. Angela Hamilton", especialidad: "Pediatría", telefono: "345-234-5680", obraSocial: "Cover Salud", costoConsulta: 55000, img: "https://i.pinimg.com/736x/e7/c6/cf/e7c6cfddd6154db93afd2611355a49c5.jpg" },
  { id: 4, nombre: "Dr. Carlos López", especialidad: "Dermatología", telefono: "345-234-5681", obraSocial: "IOMA", costoConsulta: 82000, img: "https://i.pinimg.com/736x/57/59/83/57598351d2ab9824b08717160ba1c992.jpg" }
];

if (!localStorage.getItem("medicos")) {
  localStorage.setItem("medicos", JSON.stringify(DOCTORES_INICIALES));
}

export function obtenerMedicos() {
  return JSON.parse(localStorage.getItem("medicos")) || [];
}

export function obtenerMedicoPorId(id) {
  return obtenerMedicos().find(m => m.id === parseInt(id)); 
}

function guardarMedicos(lista) {
  localStorage.setItem("medicos", JSON.stringify(lista));
}

function agregarMedico(medico) {
  const lista = obtenerMedicos();
  medico.id = Date.now(); 
  medico.img = medico.img && medico.img.trim() !== '' ? medico.img : DEFAULT_IMG_URL;
  medico.costoConsulta = parseFloat(medico.costoConsulta) || 0;
  lista.push(medico);
  guardarMedicos(lista);
  mostrarMedicos();
  cargarCatalogoProfesionales();
  cargarDestacadosIndex();
  dispatchMedicosActualizados(); 
  
  console.log("✅ Médico agregado:", medico);
}

function editarMedico(id, datosActualizados) {
  const lista = obtenerMedicos().map(m => { 
    if (m.id === parseInt(id)) {
      return {
        ...m,
        ...datosActualizados,
        img: datosActualizados.img && datosActualizados.img.trim() !== '' ? datosActualizados.img : DEFAULT_IMG_URL,
        costoConsulta: parseFloat(datosActualizados.costoConsulta) || 0,
        id: parseInt(id) 
      };
    }
    return m;
  });
  
  guardarMedicos(lista);
  mostrarMedicos();
  cargarCatalogoProfesionales();
  cargarDestacadosIndex();
  
  console.log("✏️ Médico editado, ID:", id, "Datos:", datosActualizados);
}

export function eliminarMedico(id) {
    const listaMedicos = obtenerMedicos();
    const nuevaLista = listaMedicos.filter(m => m.id !== parseInt(id)); 
    localStorage.setItem("medicos", JSON.stringify(nuevaLista));
    mostrarMedicos();
    cargarCatalogoProfesionales(); 
    cargarDestacadosIndex();
    console.log(`🗑️ Médico con ID ${id} eliminado. Lista actualizada.`);
}

function mostrarMedicos() {
  const tabla = document.getElementById("tabla-medicos");
  if (!tabla) return; 

  const lista = obtenerMedicos();

  tabla.innerHTML = lista.map(m => `
    <tr>
      <td>${m.nombre}</td>
      <td>${m.especialidad}</td>
      <td>$${parseFloat(m.costoConsulta || 0).toFixed(2)}</td>
      <td>${m.obraSocial}</td>
      <td>${m.telefono}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editar(${m.id})"><i class="bi bi-pencil"></i> Editar</button>
        <button class="btn btn-danger btn-sm" onclick="borrar(${m.id})"><i class="bi bi-trash"></i> Eliminar</button>
      </td>
    </tr>
  `).join("");
}

export function cargarCatalogoProfesionales() {
    const catalogoContainer = document.getElementById("catalogo-profesionales");
    if (!catalogoContainer) {
        console.log("⚠️ No se encontró #catalogo-profesionales");
        return;
    }

    const lista = obtenerMedicos();
    console.log("📋 Cargando catálogo con", lista.length, "médicos");
    
    if (lista.length === 0) {
        catalogoContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted">No hay médicos disponibles en este momento.</p></div>';
        return;
    }
    
    const cardsHTML = lista.map(m => `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 doctor-card shadow-sm">
                <img src="${m.img || DEFAULT_IMG_URL}" class="card-img-top" alt="Foto de ${m.nombre}"> 
                <div class="card-body">
                    <h5 class="card-title fw-bold">${m.nombre}</h5>
                    <p class="card-text mb-1 text-info"><strong>Especialidad:</strong> ${m.especialidad}</p>
                    <p class="card-text mb-1 text-secondary"><strong>Teléfono:</strong> ${m.telefono}</p>
                    <p class="card-text mb-0 text-muted"><strong>Obra Social:</strong> ${m.obraSocial}</p>
                </div>
            </div>
        </div>
    `).join("");

    catalogoContainer.innerHTML = cardsHTML;
    console.log("✅ Catálogo actualizado");
}

export function cargarDestacadosIndex() {
    const destacadosContainer = document.getElementById("destacados-index");
    if (!destacadosContainer) {
        console.log("⚠️ No se encontró #destacados-index para destacados"); 
        return;
    }
    const listaMedicos = obtenerMedicos();
    console.log("⭐ Cargando destacados con", listaMedicos.length, "médicos");
    const listaDestacada = listaMedicos;  
    const cardsHTML = listaDestacada.map(m => `
        <div class="col-12 col-md-6 col-lg-3">
            <div class="card h-100 doctor-card shadow-sm border-0">
                <img src="${m.img || DEFAULT_IMG_URL}" class="card-img-top" alt="Foto de ${m.nombre}">
                <div class="card-body text-center">
                    <h5 class="card-title fw-bold text-primary">${m.nombre}</h5>
                    <p class="card-text text-info mb-1"><strong>${m.especialidad}</strong></p>
                    <p class="card-text text-secondary small mb-2">Tel: ${m.telefono}</p>
                    <p class="card-text text-muted small mb-0">OS: ${m.obraSocial}</p>
                </div>
            </div>
        </div>
    `).join("");
    destacadosContainer.innerHTML = cardsHTML;
    console.log("✅ Destacados actualizados");
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