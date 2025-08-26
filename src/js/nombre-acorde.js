import { cromaSos, cromaBem, notasACifrado } from './config.js';
import { analizarAcorde } from './logic.js';
import { mostrarResultado, mostrarError, actualizarBoton } from './ui.js';

/**
 * Obtiene las notas actualmente seleccionadas por el usuario en los tres campos del acorde.
 * Devuelve un objeto con las propiedades: tonica, mediante y dominante.
 */
export function obtenerNotasSeleccionadas() {
    return {
        tonica: document.getElementById("notaUno").value,
        mediante: document.getElementById("notaDos").value,
        dominante: document.getElementById("notaTres").value
    };
}

/**
 * Devuelve un arreglo de las notas seleccionadas válidas, en orden:
 * [tónica, tercera, quinta, (opcional) séptima]
 */
export function obtenerNotasComoArray() {
  const usarSeptima = document.getElementById("usarSeptima").checked;

  const tonica = document.getElementById("notaUno").value;
  const tercera = document.getElementById("notaDos").value;
  const quinta  = document.getElementById("notaTres").value;
  const septima = usarSeptima ? document.getElementById("notaCuatro").value : null;

  const notas = [tonica, tercera, quinta];
  if (usarSeptima && septima) {
    notas.push(septima);
  }

  // Devuelve solo si todas las notas están seleccionadas y son distintas
  const algunaVacia = notas.some(n => !n);
  const hayRepetidas = new Set(notas).size < notas.length;

  return (!algunaVacia && !hayRepetidas) ? notas : [];
}

/**
 * Verifica si las notas seleccionadas son válidas:
 * - No deben estar vacías.
 * - No deben repetirse.
 * Actualiza el estado del botón y del mensaje de error.
 */
export function verificarNotasValidas() {
    
    const usarSeptima = document.getElementById("usarSeptima").checked;
    const { tonica, mediante, dominante } = obtenerNotasSeleccionadas();
    const septima = usarSeptima ? document.getElementById("notaCuatro").value : null;

    // Armar arreglo de notas
    const notas = [tonica, mediante, dominante];
    if (usarSeptima) notas.push(septima);

    //notas.some(n => !n): Verifica si alguna de las notas está vacía. Devuelve true si falta alguna nota.
    //new Set(notas).size < 3: Verifica si hay notas repetidas. Un Set solo guarda valores únicos.
    // Verificar:
    // - Que ninguna nota esté vacía
    // - Que todas sean distintas (Set elimina duplicados)
    const algunaVacia = notas.some(n => !n);
    const hayRepetidas = new Set(notas).size < notas.length;
    const invalido = algunaVacia || hayRepetidas;
    
    // Actualizar interfaz según validez
    actualizarBoton(invalido);     // Desactiva o activa el botón según validez
    // Mostrar mensaje personalizado según el error
    if (algunaVacia) {
        mostrarError("Debes seleccionar tres notas distintas para detectar el acorde.");
    } else if (hayRepetidas) {
        mostrarError("Las notas seleccionadas deben ser distintas.");
    } else {
        mostrarError(""); // Oculta el mensaje si todo está bien
    }

    const botonReproducir = document.getElementById("reproducirNotas");
    botonReproducir.disabled = invalido;  // solo se habilita si las notas son válidas

}

/**
 * Actualiza el contenido de los <select> con las notas disponibles (sostenidos o bemoles).
 * - Evita repetir notas ya seleccionadas en otros campos.
 * - Mantiene la opción seleccionada actual.
 */
export function actualizarOpciones() {
    const usarBemoles = document.getElementById("usarBemoles").checked;
    const notas = usarBemoles ? cromaBem : cromaSos;

    const usarSeptima = document.getElementById("usarSeptima").checked;
    const ids = ["notaUno", "notaDos", "notaTres"];
    if (usarSeptima) ids.push("notaCuatro");

    // Mostrar u ocultar el campo
    document.getElementById("campoSeptima").style.display = usarSeptima ? "block" : "none";

    //Extrae valores seleccionados u los asiga a seleccionadas
    const seleccionadas = Object.values(obtenerNotasSeleccionadas());

    ids.forEach(id => {
        const select = document.getElementById(id);
        const actual = select.value;
        select.innerHTML = "";  // Limpia las opciones actuales

        notas.forEach(nota => {
            // Solo agrega la nota si no está seleccionada en otro campo,
            // o si es la opción actualmente seleccionada
            if (!seleccionadas.includes(nota) || nota === actual) {
                const option = document.createElement("option");
                option.value = nota;
                option.textContent = nota;
                if (nota === actual) option.selected = true;
                select.appendChild(option);
                if (!actual && !select.value && optionIndex === 0) {
                select.value = nota; // asigna la primera opción válida como seleccionada
}
            }
        });
    });

    verificarNotasValidas(); // Revalida al actualizar opciones
}

/**
 * Llama al análisis del acorde según las notas seleccionadas y el tipo de notación.
 * Si el acorde es válido, muestra el resultado en ambas notaciones.
 * Si no se reconoce, muestra un mensaje de error en pantalla.
 */
export function detectarAcorde() {
    const { tonica, mediante, dominante } = obtenerNotasSeleccionadas();
    const usarBemoles = document.getElementById("usarBemoles").checked;
    const usarSeptima = document.getElementById("usarSeptima").checked;
    const septima = usarSeptima ? document.getElementById("notaCuatro").value : null;
    const resultado = analizarAcorde(tonica, mediante, dominante, usarBemoles, septima);

    if (!resultado) {
        // Caso en que el acorde no corresponde a una estructura reconocida
        mostrarError("La combinación ingresada no forma un acorde en su inversión fundamental.");
        mostrarResultado("Acorde no reconocido", "Acorde no reconocido");
        return;
    }
    const { tipoLatina, tipoAmericana, tonicaAmericana } = resultado;

    if (tipoLatina === "desconocido" || tipoAmericana === "?") {
        mostrarError("La combinación ingresada no forma un acorde en su inversión fundamental.");
        mostrarResultado("Acorde no reconocido", "Acorde no reconocido");
        return;
    }

    const nombreLatino = `${tonica} ${tipoLatina}`;
    const nombreAmericano = `${tonicaAmericana}${tipoAmericana}`;
    mostrarError(""); // limpia cualquier error previo
    mostrarResultado(nombreLatino, nombreAmericano);
}
