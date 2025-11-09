import { obtenerMedicos } from "./Medico.js";

document.addEventListener("DOMContentLoaded", () => {
  const especialidadSelect = document.getElementById("especialidad");
  const medicoSelect = document.getElementById("medico");

  if (!especialidadSelect || !medicoSelect) {
    console.error("No se encontró #especialidad o #medico en el DOM.");
    return;
  }

  const medicos = obtenerMedicos();
  console.log("seleccionMedico -> medicos cargados:", medicos);

  if (!medicos || !medicos.length) {
    console.warn("No hay médicos en localStorage.");
    return;
  }


  especialidadSelect.addEventListener("change", () => {
    const seleccion = especialidadSelect.value;

    medicoSelect.innerHTML = "<option value=''>Seleccione un médico</option>";

    if (!seleccion) {
      medicoSelect.disabled = true;
      return;
    }

    const medicosFiltrados = medicos.filter(m => m.especialidad === seleccion);

    if (!medicosFiltrados.length) {
      medicoSelect.innerHTML = "<option value=''>No hay médicos disponibles</option>";
      medicoSelect.disabled = true;
      return;
    }

    medicosFiltrados.forEach(m => {
      const option = document.createElement("option");
      option.value = m.id;
      const costo = typeof m.costoConsulta === "number" ? m.costoConsulta : (Number(m.costoConsulta) || 0);
      option.textContent = `${m.nombre}${costo ? ` (Costo: $${costo.toFixed(2)})` : ''}`;
      medicoSelect.appendChild(option);
    });

    medicoSelect.disabled = false;
  });
});

