// Punto de entrada: gestiona eventos e inicia la app

import { valorInicial, filtrarAlteraciones } from './ui.js';
import { nombreAcorde, obtenerNotasActuales } from './logic.js';
import { reproducirArpegioMixto } from './sound.js';
import { enviarEventoGA } from './gtag-events.js';

window.addEventListener('DOMContentLoaded', () => {
    valorInicial();
    filtrarAlteraciones();
    nombreAcorde();

    const ids = ["tonos", "alteracion", "alteracionM"];
    ids.forEach(id => {
        document.getElementById(id).addEventListener("change", (e) => {
            if (id === "tonos") filtrarAlteraciones();
            nombreAcorde();

            // Evento GA4: seguimiento por tipo de selector
        const valorSeleccionado = e.target.value;
            const nombreEvento = {
                tonos: "cambio_tono",
                alteracion: "cambio_tipo_acorde",
                alteracionM: "cambio_modo"
            }[id];

            enviarEventoGA(nombreEvento, "interaccion_usuario", valorSeleccionado);
        });
    });

    const playBtn = document.getElementById("playChordBtn");
    let reproduciendo = false;

    playBtn.addEventListener("click", () => {
        if (reproduciendo) return; // Evita múltiples clics durante reproducción

        const notas = obtenerNotasActuales();
        if (notas.length === 0) return;

        reproduciendo = true;
        playBtn.disabled = true;
        reproducirArpegioMixto(notas);

        // 🔔 GA4 - Evento personalizado
        enviarEventoGA("reproducir_acorde", "interaccion_usuario", notas.join(', '), notas.length);

        // Espera el tiempo del arpegio antes de reactivar el botón
        setTimeout(() => {
            reproduciendo = false;
            playBtn.disabled = false;
        }, 3100); // ajusta el delay según duración real del arpegio
    });
});

// 🎯 Eventos GA4 para clics en redes sociales (YouTube, Twitch, Discord)
document.querySelectorAll(".footer-links a").forEach(link => {
    link.addEventListener("click", () => {
        const red = link.getAttribute("aria-label");
        if (red) {
            enviarEventoGA(`click_${red.toLowerCase()}`, "redes_sociales", red);
        }
    });
});

