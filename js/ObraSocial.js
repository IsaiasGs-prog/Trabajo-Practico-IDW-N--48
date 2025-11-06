export const OBRAS_SOCIALES_INICIALES = [
    { id: 101, nombre: "Andar", descuento: 0.15, acepta: ["Cardiología", "Pediatría"] },
    { id: 102, nombre: "Construir Salud", descuento: 0.20, acepta: ["Ginecología", "Dermatología"] },
    { id: 103, nombre: "Cover Salud", descuento: 0.10, acepta: ["Pediatría", "Cardiología", "Ginecología"] },
    { id: 104, nombre: "IOMA", descuento: 0.25, acepta: ["Dermatología", "Cardiología", "Ginecología", "Pediatría"] },
    { id: 105, nombre: "Particular", descuento: 0.00, acepta: ["Todas"] } 
];

if (!localStorage.getItem("obrasSociales")) {
    localStorage.setItem("obrasSociales", JSON.stringify(OBRAS_SOCIALES_INICIALES));
}

export function obtenerObrasSociales() {
    return JSON.parse(localStorage.getItem("obrasSociales")) || [];
}

export function guardarObrasSociales(lista) {
    localStorage.setItem("obrasSociales", JSON.stringify(lista));
}


export function obtenerObrasSociales() {
    return JSON.parse(localStorage.getItem("obrasSociales")) || [];
}

export function obtenerObraSocialPorId(id) {
    return obtenerObrasSociales().find(os => os.id === id);
}

// Otras funciones CRUD (agregar, actualizar, eliminar) para el futuro panel Admin
// ...