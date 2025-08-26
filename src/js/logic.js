// Lógica principal para construir el acorde

import { cromaSos, cromaBem, acordes, notasBase, cifradoANotas, notasACifrado } from './config.js';
import { obtenerValoresSeleccionados, mostrarError } from './ui.js';
import { traducirNotas, mostrar } from './utils.js';
import { reproducirArpegioMixto } from './sound.js';

/**
 * Devuelve las notas del acorde actual, cada una con su nota y octava.
 * @returns {{nota: string, octava: number}[]} Lista de notas con octava.
 */

let notasActuales = []; // Se actualizará cada vez que cambie el acorde

export function generarNombreAcorde() {
    const { tono, alter, tipoA } = obtenerValoresSeleccionados();
    return tono + (alter !== " " ? alter : "") + (tipoA !== " " ? tipoA : "");
}


export function nombreAcorde(){
    
    const { tono, alter, tipoA } = obtenerValoresSeleccionados();

    let nombre = generarNombreAcorde();
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

//PARA nombre-acorde.html//

// Función que traduce notas en notación latina (como "do", "re♯") a notación americana (como "C", "D♯")
// Recibe un array de notas y devuelve un array traducido
export function traducirTonica(cifrado) {
    return cifrado.map(nota => notasACifrado[nota]).filter(Boolean); // Filtra valores válidos
}

// Analiza las notas ingresadas y determina el tipo de acorde
export function analizarAcorde(tonica, mediante, dominante, usarBemoles,septima) {
    
    const usarSeptima = !!septima;  // true si se pasó una séptima, false si no

    // Selecciona la escala cromática a usar según la preferencia de notación
    const cromatica = usarBemoles ? cromaBem : cromaSos;

    // Obtiene los índices de las notas en la escala cromática
    const i1 = cromatica.indexOf(tonica);     // Índice de la tónica
    const i2 = cromatica.indexOf(mediante);   // Índice de la tercera
    const i3 = cromatica.indexOf(dominante);  // Índice de la quinta
    const i7 = usarSeptima ? cromatica.indexOf(septima) : null;
    console.log(tonica, mediante, dominante,septima);

    // Verifica que todas las notas estén presentes en la escala
    if (i1 === -1 || i2 === -1 || i3 === -1 ||(usarSeptima && i7 === -1)) return null;

    // Función auxiliar para calcular intervalos (en semitonos) dentro de una escala circular de 12 notas
    const distancia = (a, b) => (b - a + 12) % 12;

    // Calcula los intervalos desde la tónica a las otras dos notas
    const intervalo3 = distancia(i1, i2); // intervalo tónica - tercera
    const intervalo5 = distancia(i1, i3); // intervalo tónica - quinta
    const intervalo7 = usarSeptima ? distancia(i1, i7) : null;
    console.log(intervalo3, intervalo5, intervalo7)

    // Inicializa los tipos por defecto
    let tipoLatina = "desconocido", tipoAmericana = "?";

    // Determina el tipo de acorde según los intervalos
    // Acordes con séptima
if (usarSeptima && intervalo7 !== null) {
    if (intervalo3 === 3 && intervalo5 === 6 && intervalo7 === 10) {
        tipoLatina = "semidisminuido"; tipoAmericana = "m7♭5";
    } else if (intervalo3 === 3 && intervalo5 === 7 && intervalo7 === 10) {
        tipoLatina = "menor séptima"; tipoAmericana = "m7";
    } else if (intervalo3 === 4 && intervalo5 === 7 && intervalo7 === 10) {
        tipoLatina = "séptima dominante"; tipoAmericana = "7";
    } else if (intervalo3 === 4 && intervalo5 === 7 && intervalo7 === 11) {
        tipoLatina = "mayor séptima"; tipoAmericana = "maj7";
    } else if (intervalo3 === 3 && intervalo5 === 7 && intervalo7 === 11) {
    tipoLatina = "menor con séptima mayor"; tipoAmericana = "mMaj7";
    } else if (intervalo3 === 3 && intervalo5 === 6 && intervalo7 === 9) {
        tipoLatina = "disminuido completo"; tipoAmericana = "°7";
    } else {
        // Si hay séptima pero no coincide con ningún patrón conocido, no asumir tríada
        tipoLatina = "desconocido";
        tipoAmericana = "?";
        mostrarError("La combinación ingresada no forma un acorde en su inversión fundamental.");
    }
} else if (!usarSeptima) {
    // Acordes sin séptima
    if (intervalo3 === 4 && intervalo5 === 7) {
        tipoLatina = "mayor"; tipoAmericana = "";
    } else if (intervalo3 === 3 && intervalo5 === 7) {
        tipoLatina = "menor"; tipoAmericana = "m";
    } else if (intervalo3 === 3 && intervalo5 === 6) {
        tipoLatina = "disminuido"; tipoAmericana = "°";
    } else if (intervalo3 === 4 && intervalo5 === 8) {
        tipoLatina = "aumentado"; tipoAmericana = "+";
    } else if (intervalo3 === 2 && intervalo5 === 7) {
        tipoLatina = "suspendido 2"; tipoAmericana = "sus2";
    } else if (intervalo3 === 5 && intervalo5 === 7) {
        tipoLatina = "suspendido 4"; tipoAmericana = "sus4";
    } else{
        mostrarError("La combinación ingresada no forma un acorde en su inversión fundamental.");
    }
}

    // Devuelve un objeto con la información del acorde
    return {
        tipoLatina,                        // Ej. "mayor", "menor"
        tipoAmericana,                    // Ej. "", "m", "°"
        tonicaAmericana: traducirTonica([tonica])[0] // Traducción a notación americana
    };

    
}