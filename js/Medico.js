
export const DOCTORES_INICIALES = [
  { id: 1, nombre: "Dr. Juan Pérez", especialidad: "Cardiología", telefono: "345-234-5678", obraSocial: "Andar" },
  { id: 2, nombre: "Dra. Ana Gómez", especialidad: "Ginecología", telefono: "345-234-5679", obraSocial: "Construir Salud" },
  { id: 3, nombre: "Dra. Angela Hamilton", especialidad: "Pediatría", telefono: "345-234-5680", obraSocial: "Cover Salud" },
  { id: 4, nombre: "Dr. Carlos López", especialidad: "Dermatología", telefono: "345-234-5681", obraSocial: "IOMA" }
];

if (!localStorage.getItem("medicos")) {
  localStorage.setItem("medicos", JSON.stringify(DOCTORES_INICIALES));
}

function obtenerMedicos() {
  return JSON.parse(localStorage.getItem("medicos")) || [];
}

function guardarMedicos(lista) {
  localStorage.setItem("medicos", JSON.stringify(lista));
}

function agregarMedico(medico) {
  const lista = obtenerMedicos();
  medico.id = Date.now();
  lista.push(medico);
  guardarMedicos(lista);
  mostrarMedicos();
}

function eliminarMedico(id) {
  const lista = obtenerMedicos().filter(m => m.id !== id);
  guardarMedicos(lista);
  mostrarMedicos();
}

function editarMedico(id, datosActualizados) {
  const lista = obtenerMedicos().map(m => m.id === id ? { ...m, ...datosActualizados } : m);
  guardarMedicos(lista);
  mostrarMedicos();
}

function mostrarMedicos() {
  const tabla = document.getElementById("tabla-medicos");
  const lista = obtenerMedicos();

  tabla.innerHTML = lista.map(m => `
    <tr>
      <td>${m.nombre}</td>
      <td>${m.especialidad}</td>
      <td>${m.telefono}</td>
      <td>${m.obraSocial}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editar(${m.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="borrar(${m.id})">Eliminar</button>
      </td>
    </tr>
  `).join("");
}


document.addEventListener("DOMContentLoaded", () => {
  mostrarMedicos();

  const form = document.getElementById("form-medico");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nuevoMedico = {
      nombre: form.nombre.value,
      especialidad: form.especialidad.value,
      telefono: form.telefono.value,
      obraSocial: form.obraSocial.value
    };
    agregarMedico(nuevoMedico);
    form.reset();
  });
});


window.borrar = eliminarMedico;
window.editar = (id) => {
  const medico = obtenerMedicos().find(m => m.id === id);
  if (!medico) return;

  const nuevoNombre = prompt("Nuevo nombre:", medico.nombre);
  const nuevaEsp = prompt("Nueva especialidad:", medico.especialidad);
  const nuevoTel = prompt("Nuevo teléfono:", medico.telefono);
  const nuevaObra = prompt("Nueva obra social:", medico.obraSocial);

  if (nuevoNombre && nuevaEsp && nuevoTel && nuevaObra) {
    editarMedico(id, { nombre: nuevoNombre, especialidad: nuevaEsp, telefono: nuevoTel, obraSocial: nuevaObra });
  }
};
