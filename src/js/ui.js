// Funciones relacionadas con la interfaz de usuario

// Esta función reinicia los selectores de alteración y tipo de acorde
// Establece el valor inicial vacío (sin alteración y sin tipo)
export function valorInicial() {
    document.getElementById("alteracion").value = " ";
    document.getElementById("alteracionM").value = " ";    
}

// Esta función devuelve un objeto con los valores actualmente seleccionados
// en los <select> del acorde (tónica, alteración y tipo)
export function obtenerValoresSeleccionados() {
    return {
        tono: document.getElementById("tonos").value,         // Nota base (ej: C, D, E...)
        alter: document.getElementById("alteracion").value,   // Sostenido (#), bemol (b) o ninguno
        tipoA: document.getElementById("alteracionM").value   // Tipo de acorde (mayor, menor, 7, etc.)
    };
}

// Esta función muestra u oculta las alteraciones (# y b) según la nota seleccionada
export function filtrarAlteraciones() {
    // Resetea las selecciones previas cada vez que se cambia la tónica
    valorInicial();    

    // Obtiene la tónica seleccionada
    const tono = document.getElementById("tonos").value;

    // Lógica para mostrar/ocultar opciones según la nota
    if (tono === "B" || tono === "E") {
        // En B y E no se usan sostenidos (#), sólo se muestra la opción bemol (b)
        document.getElementById("sostenido").style.display = "none";
        document.getElementById("bemol").style.display = "inline";

    } else if (tono === "C" || tono === "F") {
        // En C y F no se usan bemoles (b), sólo se muestra sostenido (#)
        document.getElementById("sostenido").style.display = "inline";
        document.getElementById("bemol").style.display = "none";

    } else {
        // En cualquier otra tónica, se permiten tanto sostenidos como bemoles
        document.getElementById("sostenido").style.display = "inline";
        document.getElementById("bemol").style.display = "inline";
    }
}

