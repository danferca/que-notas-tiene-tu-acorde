// Importa las funciones que gestionan eventos y lógica de interacción
import { actualizarOpciones, verificarNotasValidas, detectarAcorde, obtenerNotasComoArray } from './nombre-acorde.js';
import { reproducirArpegioMixto } from "./sound.js";
import { inicializarMenuHamburguesa } from './menu.js';
import { enviarEventoGA } from './gtag-events.js'; // 📊 GA4

// Espera a que el documento HTML se haya cargado completamente
document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada: inicializando eventos");

    // Inicializa las opciones
    actualizarOpciones();

    // Cambio de usar séptima
    document.getElementById("usarSeptima").addEventListener("change", (e) => {
        actualizarOpciones();
        enviarEventoGA("toggle_septima", "interaccion_usuario", null, null, {
            estado: e.target.checked ? "activada" : "desactivada"
        });
    });

    // Selects principales y uso de bemoles
    ["notaUno", "notaDos", "notaTres", "usarBemoles"].forEach(id => {
        document.getElementById(id).addEventListener("change", (e) => {
            actualizarOpciones();
            if (id !== "usarBemoles") {
                registrarNota(id, e.target.value);
            } else {
                enviarEventoGA("toggle_bemoles", "interaccion_usuario", null, null, {
                    estado: e.target.checked ? "activado" : "desactivado"
                });
            }
        });
    });

    // Cambio en séptima
    document.getElementById("notaCuatro")?.addEventListener("change", (e) => {
        registrarNota("notaCuatro", e.target.value);
    });

    // Detectar acorde
    document.getElementById("detectarAcorde").addEventListener("click", () => {
        detectarAcorde();
        const notas = obtenerNotasComoArray();
        if (notas.length > 0) {
            enviarEventoGA("detectar_acorde", "interaccion_usuario", notas.join(', '), notas.length, {
                incluye_septima: document.getElementById("usarSeptima").checked
            });
        }
    });

    // Reproducir acorde
    const playBtn = document.getElementById("reproducirNotas");
    let reproduciendo = false;
    playBtn.addEventListener("click", () => {
            if (reproduciendo) return; // Evita múltiples clics durante reproducción
    
            const notas = obtenerNotasComoArray();
            if (notas.length > 0) {
    
            reproduciendo = true;
            playBtn.disabled = true;
            reproducirArpegioMixto(notas);
    
            // 🔔 GA4 - Evento personalizado
            enviarEventoGA("reproducir_acorde", "interaccion_usuario", notas.join(', '), notas.length, {
                incluye_septima: document.getElementById("usarSeptima").checked
            });
        }    
            // Espera el tiempo del arpegio antes de reactivar el botón
            setTimeout(() => {
                reproduciendo = false;
                playBtn.disabled = false;
            }, 3100); // ajusta el delay según duración real del arpegio
        });

    // Verifica si las notas seleccionadas son válidas al cargar la página
    verificarNotasValidas();
});

// 📊 Contador de selecciones de notas
const contadorNotas = {
    notaUno: {},
    notaDos: {},
    notaTres: {},
    notaCuatro: {}
};

function registrarNota(campo, nota) {
    if (!contadorNotas[campo][nota]) {
        contadorNotas[campo][nota] = 0;
    }
    contadorNotas[campo][nota]++;

    enviarEventoGA("seleccion_nota", "interaccion_usuario", nota, null, {
        campo: campo,
        total_selecciones: contadorNotas[campo][nota]
    });
}
