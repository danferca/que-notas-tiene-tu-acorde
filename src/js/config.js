// Declaración de variables y estructuras base

// Escalas cromáticas
export const cromaSos = ["do","do♯","re","re♯","mi","fa","fa♯","sol","sol♯","la","la♯","si"];
export const cromaBem = ["do","re♭","re","mi♭","mi","fa","sol♭","sol","la♭","la","si♭","si"];

// Diccionario de traducción desde cifrado anglosajón a notación latina
export const cifradoANotas = {
  "C": "do", "C#": "do♯", "Db": "re♭", "D": "re", "D#": "re♯", "Eb": "mi♭",
  "E": "mi", "F": "fa", "F#": "fa♯", "Gb": "sol♭", "G": "sol", "G#": "sol♯",
  "Ab": "la♭", "A": "la", "A#": "la♯", "Bb": "si♭", "B": "si"
};

// Diccionario de acordes e intervalos (en semitonos desde la tónica)
export const acordes = {
  " ": [0, 4, 7],               // Mayor
  "m": [0, 3, 7],               // Menor
  "sus2": [0, 2, 7],
  "sus4": [0, 5, 7],
  "°": [0, 3, 6],               // Disminuido
  "+": [0, 4, 8],               // Aumentado
  "7": [0, 4, 7, 10],           // Séptima dominante
  "maj7": [0, 4, 7, 11],        // Séptima mayor
  "m7": [0, 3, 7, 10],          // Menor séptima
  "m7b5": [0, 3, 6, 10],        // Semidisminuido
  "6": [0, 4, 7, 9],            // Sexta
  "m6": [0, 3, 7, 9],           // Menor sexta

  // Extendidos
  "9": [0, 4, 7, 10, 14],
  "maj9": [0, 4, 7, 11, 14],
  "m9": [0, 3, 7, 10, 14],
  "11": [0, 4, 7, 10, 14, 17],
  "m11": [0, 3, 7, 10, 14, 17],
  "13": [0, 4, 7, 10, 14, 17, 21],
  "m13": [0, 3, 7, 10, 14, 17, 21]
};

// Mapa de notas base para cálculo de semitonos relativos desde "do"
export const notasBase = {
  "do": 0, "do♯": 1, "re": 2, "re♯": 3, "mi": 4,
  "fa": 5, "fa♯": 6, "sol": 7, "sol♯": 8,
  "la": 9, "la♯": 10, "si": 11
};

// Equivalencias de bemoles a sostenidos (enarmónicos)
export const equivalencias = {
  "re♭": "do♯",
  "mi♭": "re♯",
  "sol♭": "fa♯",
  "la♭": "sol♯",
  "si♭": "la♯"
};



// Función para calcular la frecuencia de una nota musical dada su notación latina y octava
export function calcularFrecuenciaNota(nota, octava = 4) {
  // Normaliza la nota: si es un bemol, se convierte a su equivalente sostenido
  const notaNormalizada = equivalencias[nota] || nota;

  // Cromática base en notación latina con sostenidos
  const croma = cromaSos;

  // Busca la posición de la nota en la escala cromática
  const index = croma.indexOf(notaNormalizada);

  // Si no se encontró la nota (es inválida), se retorna null
  if (index === -1) return null;

  // Calcula el número relativo de semitonos desde la nota LA4 (440 Hz)
  const n = index + 12 * (octava - 4);

  // Calcula la frecuencia usando la fórmula del temperamento igual
  return 440 * Math.pow(2, (n - 9) / 12);
}