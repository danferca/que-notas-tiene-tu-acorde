// Lógica principal para construir el acorde

import { cromaSos, cromaBem, acordes, notasBase, cifradoANotas } from './config.js';
import { obtenerValoresSeleccionados } from './ui.js';
import { traducirNotas, mostrar } from './utils.js';
import { reproducirArpegioMixto } from './sound.js';

/**
 * Devuelve las notas del acorde actual, cada una con su nota y octava.
 * @returns {{nota: string, octava: number}[]} Lista de notas con octava.
 */

let notasActuales = []; // Se actualizará cada vez que cambie el acorde

export function nombreAcorde(){
    
    const { tono, alter, tipoA } = obtenerValoresSeleccionados();

    let nombre = tono + (alter !== " " ? alter : "") + (tipoA !== " " ? tipoA : "");
    let notaBase = tono + (alter ==="#" || alter ==="b" ? alter : "");

    const usarSostenidos = !["m", "m7", "m7b5", "°", "m6","m9","m11","m13"].includes(tipoA);
    let cromatica = usarSostenidos ? cromaSos : cromaBem;

    let notaTraducida = traducirNotas([notaBase])[0];
    let idx = cromatica.indexOf(notaTraducida);

    if (idx === -1) {
        const otraCromatica = usarSostenidos ? cromaBem : cromaSos;
        idx = otraCromatica.indexOf(notaTraducida);
        if (idx !== -1) {
            cromatica = otraCromatica;
        } else {
            mostrar("", []);
            return;
        }
    }

    const intervalos = acordes[tipoA];
    if (!intervalos) {
        mostrar(`Acorde no definido: ${tipoA}`, []);
        return;
    }

    let notas = intervalos.map(i => cromatica[(idx + i) % 12]);
    notasActuales = notas;
    mostrar(nombre, notas);
    //reproducirArpegioMixto(notas);
}

export function obtenerNotasActuales() {
    return notasActuales;
}