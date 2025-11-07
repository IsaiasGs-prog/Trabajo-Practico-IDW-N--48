export const OBRAS_SOCIALES_INICIALES = [
    { id: 101, nombre: "Andar", descuento: 0.15, acepta: ["Cardiología", "Pediatría"] },
    { id: 102, nombre: "Construir Salud", descuento: 0.20, acepta: ["Ginecología", "Dermatología"] },
    { id: 103, nombre: "Cover Salud", descuento: 0.10, acepta: ["Pediatría", "Cardiología", "Ginecología"] },
    { id: 104, nombre: "IOMA", descuento: 0.25, acepta: ["Dermatología", "Cardiología", "Ginecología", "Pediatría"] },
    { id: 105, nombre: "Particular", descuento: 0.00, acepta: ["Todas"] } 
];

const OBRAS_SOCIALES_KEY = "obrasSociales";

if (!localStorage.getItem(OBRAS_SOCIALES_KEY)) {
    localStorage.setItem(OBRAS_SOCIALES_KEY, JSON.stringify(OBRAS_SOCIALES_INICIALES));
}

export function obtenerObrasSociales() {
    return JSON.parse(localStorage.getItem(OBRAS_SOCIALES_KEY)) || [];
}

export function guardarObrasSociales(lista) {
    localStorage.setItem(OBRAS_SOCIALES_KEY, JSON.stringify(lista));
}

export function obtenerObraSocialPorId(id) {
    const numId = parseInt(id);
    return obtenerObrasSociales().find(os => os.id === numId);
}