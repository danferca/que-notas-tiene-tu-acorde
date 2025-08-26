// sound.js
import { calcularFrecuenciaNota, cromaSos, cromaBem } from './config.js';

// Transposición automática a un rango audible
function ajustarRango(frecuencia, minimo = 80, maximo = 2000) {
  while (frecuencia < minimo) frecuencia *= 2;
  while (frecuencia > maximo) frecuencia /= 2;
  return frecuencia;
}

// Formas de onda combinadas por defecto (puedes ajustar si deseas otro timbre)
const formasPorDefecto = ['square', 'sawtooth', 'sine', 'triangle'];

/**
 * Determina la octava base en función de la tónica del acorde.
 * Si la tónica está desde FA en adelante, se usa la octava 3, si no, la 4.
 */
function obtenerOctavaBase(tonica) {
  // Paso 1: Determina si la tónica está escrita con bemol (♭).
  // Si está en la lista de bemoles comunes, usamos la escala cromática con bemoles (cromaBem).
  // Si no, usamos la escala con sostenidos (cromaSos).
  const usarSostenidos = !["re♭", "mi♭", "sol♭", "la♭", "si♭"].includes(tonica);

  // Selecciona la cromática según el tipo de notación (sostenido o bemol)
  let cromatica = usarSostenidos ? cromaSos : cromaBem;

  // Paso 2: Intenta encontrar el índice de la tónica en la cromática elegida
  let index = cromatica.indexOf(tonica);

  // Si la nota no se encontró en esa cromática (puede pasar por ambigüedades),
  // intenta buscarla en la otra (por ejemplo si era un bemol pero estás en la de sostenidos).
  if (index === -1) {
    const otraCromatica = usarSostenidos ? cromaBem : cromaSos;
    index = otraCromatica.indexOf(tonica);

    // Si la encuentra en la otra cromática, cambia la cromática activa
    if (index !== -1) {
      cromatica = otraCromatica;
    } else {
      // Si no se encuentra en ninguna, retorna por defecto la octava 4 (para evitar errores)
      return 4;
    }
  }

  // Paso 3: Ya con el índice correcto, decidimos la octava base:
  // Si la tónica está en o después de "fa", consideramos que suena mejor en la octava 3,
  // de lo contrario, en la octava 4.
  return index >= cromatica.indexOf("mi") ? 3 : 4;
}
/**
 * Reproduce un arpegio seguido de un acorde completo, usando progresión de octavas realista.
 * @param {string[]} notas - Lista de notas en notación latina (ej: ["do", "mi", "sol"]).
 * @param {string[]} formas - Lista de formas de onda para mezclar el sonido (por defecto: varias).
 */
export function reproducirArpegioMixto(notas, formas = formasPorDefecto) {
  const contexto = new (window.AudioContext || window.webkitAudioContext)();
  const duracionArpegio = 1.5;
  const duracionAcorde = 3.5;
  const intervalo = 0.6;

  const tonica = notas[0]; // Se asume que la primera es la raíz del acorde
  const octavaBase = obtenerOctavaBase(tonica);

  // === Arpegio: nota por nota con octava creciente ===
  let frecuenciaBase = null;

  notas.forEach((nota, i) => {
    let octava = octavaBase;

    if (frecuenciaBase !== null) {
      // Aumentar la octava hasta que la frecuencia sea igual o mayor a la anterior
      while (calcularFrecuenciaNota(nota, octava) < frecuenciaBase && octava < 7) {
        octava++;
      }
    }

    const frecuencia = calcularFrecuenciaNota(nota, octava);
    if (!frecuencia) return;

    frecuenciaBase = frecuencia;
    const tiempo = contexto.currentTime + i * intervalo;

    reproducirNotaCompleja(contexto, frecuencia, tiempo, duracionArpegio, formas);
  });

  // === Acorde completo: mismas notas, misma lógica de octava ===
  const tiempoFinal = contexto.currentTime + notas.length * intervalo + 0.3;
  let frecuenciaAnterior = null;

  notas.forEach(nota => {
    let octava = octavaBase;

    if (frecuenciaAnterior !== null) {
      while (
        calcularFrecuenciaNota(nota, octava) <= frecuenciaAnterior &&
        octava < 7
      ) {
        octava++;
      }
    }

    const frecuencia = calcularFrecuenciaNota(nota, octava);
    if (!frecuencia) return;

    frecuenciaAnterior = frecuencia;
    const ajustada = ajustarRango(frecuencia);

    reproducirNotaCompleja(contexto, ajustada, tiempoFinal, duracionAcorde, formas);
    console.log(`  🎶 ${nota}${octava} → ${ajustada.toFixed(2)} Hz`);
  });
}

/**
 * Reproduce una nota combinando múltiples formas de onda, con envolvente de volumen.
 * @param {AudioContext} contexto - El contexto de audio del navegador.
 * @param {number} frecuencia - Frecuencia en Hz de la nota a reproducir.
 * @param {number} tiempo - Momento en que debe comenzar la nota.
 * @param {number} duracion - Duración total de la nota (segundos).
 * @param {string[]} formas - Tipos de forma de onda a combinar (sine, square, etc).
 */
function reproducirNotaCompleja(contexto, frecuencia, tiempo, duracion, formas) {
  const mezcla = contexto.createGain();

  formas.forEach(forma => {
    const osc = contexto.createOscillator();
    const gain = contexto.createGain();

    osc.type = forma;
    osc.frequency.value = frecuencia;
    gain.gain.setValueAtTime(0.2 / formas.length, tiempo); // Volumen proporcional

    osc.connect(gain);
    gain.connect(mezcla);

    osc.start(tiempo);
    osc.stop(tiempo + duracion);
  });

  const filtro = contexto.createBiquadFilter();
  filtro.type = 'lowpass'; // Suaviza el timbre
  filtro.frequency.value = 1000;

  const salida = contexto.createGain();
  salida.gain.setValueAtTime(0.001, tiempo); // Fade in suave
  salida.gain.linearRampToValueAtTime(0.6, tiempo + 0.1);
  salida.gain.exponentialRampToValueAtTime(0.001, tiempo + duracion); // Fade out natural

  mezcla.connect(filtro);
  filtro.connect(salida);
  salida.connect(contexto.destination);
}
