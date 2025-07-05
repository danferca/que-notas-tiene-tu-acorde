// Punto de entrada: gestiona eventos e inicia la app

import { valorInicial, filtrarAlteraciones } from './ui.js';
import { nombreAcorde, obtenerNotasActuales } from './logic.js';
import { reproducirArpegioMixto } from './sound.js';

window.addEventListener('DOMContentLoaded', () => {
    valorInicial();
    filtrarAlteraciones();
    nombreAcorde();

    const ids = ["tonos", "alteracion", "alteracionM"];
    ids.forEach(id => {
        document.getElementById(id).addEventListener("change", () => {
            if (id === "tonos") filtrarAlteraciones();
            nombreAcorde();
        });
    });

    document.getElementById("playChordBtn").addEventListener("click", () => {
        const notas = obtenerNotasActuales();
        if (notas.length > 0) reproducirArpegioMixto(notas);
    });
});
