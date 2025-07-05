// Punto de entrada: gestiona eventos e inicia la app

import { valorInicial, filtrarAlteraciones } from './ui.js';
import { nombreAcorde, obtenerNotasActuales } from './logic.js';
import { reproducirArpegioMixto } from './sound.js';

window.addEventListener('DOMContentLoaded', () => {
    valorInicial();
    filtrarAlteraciones();
    nombreAcorde();
});

document.getElementById("tonos").addEventListener("change", () => {
    filtrarAlteraciones();
    nombreAcorde();
});

document.getElementById("alteracion").addEventListener("change", () => {
    nombreAcorde();
});

document.getElementById("alteracionM").addEventListener("change", () => {
    nombreAcorde();
});

document.getElementById("playChordBtn").addEventListener("click", () => {
    const notas = obtenerNotasActuales();
    console.log("Notas a reproducir:", notas);  // <- importante para depurar
    if (notas.length > 0) reproducirArpegioMixto(notas);
});
