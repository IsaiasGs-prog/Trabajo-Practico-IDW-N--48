
export const OBRAS_SOCIALES_INICIALES = [
  { id: 101, nombre: "Andar", descuento: 0.15, acepta: ["Cardiología", "Pediatría"] },
  { id: 102, nombre: "Construir Salud", descuento: 0.20, acepta: ["Ginecología", "Dermatología"] },
  { id: 103, nombre: "Cover Salud", descuento: 0.10, acepta: ["Pediatría", "Cardiología", "Ginecología"] },
  { id: 104, nombre: "IOMA", descuento: 0.25, acepta: ["Dermatología", "Cardiología", "Ginecología", "Pediatría"] },
  { id: 105, nombre: "Particular", descuento: 0.00, acepta: ["Todas"] } 
];

const CLAVE = "obrasSociales";


export function obtenerObrasSociales() {
  let lista = JSON.parse(localStorage.getItem(CLAVE));
  if (!lista || lista.length === 0) {
    localStorage.setItem(CLAVE, JSON.stringify(OBRAS_SOCIALES_INICIALES));
    lista = OBRAS_SOCIALES_INICIALES;
  }
  return lista;
}


export function guardarObrasSociales(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

export function obtenerObraSocialPorId(id) {
  return obtenerObrasSociales().find(os => os.id === id);
}
