// Funciones utilitarias para mostrar y traducir notas

import { cifradoANotas } from './config.js';

// Traduce lista de notas desde cifrado a notación latina
export function traducirNotas(cifrado){
    return cifrado.map(nota => cifradoANotas[nota]).filter(Boolean);        
}

// Mostrar el nombre del acorde y sus notas en HTML
export function mostrar(acorde, notasArray){
    document.getElementById("tonoSelect").innerText = acorde;
    document.getElementById("notasSelect").innerText = notasArray.join(" - ");
}
