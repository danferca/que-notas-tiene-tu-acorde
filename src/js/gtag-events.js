// gtag-events.js

/**
 * Envía un evento a Google Analytics 4 (GA4) si gtag está disponible.
 *
 * @param {string} nombreEvento - Nombre del evento (ej: "cambio_tono", "reproducir_acorde")
 * @param {string} categoria - Categoría del evento (ej: "interaccion_usuario")
 * @param {string} etiqueta - Etiqueta descriptiva (ej: valor seleccionado, notas del acorde)
 * @param {number|null} valor - Valor numérico opcional (ej: cantidad de notas)
 */
export function enviarEventoGA(nombreEvento, categoria, etiqueta = null, valor = null, extras={}) {
    if (typeof gtag === "function") {
        const data = {
            event_category: categoria,
        };
        if (etiqueta !== null) data.event_label = etiqueta;
        if (valor !== null) data.value = valor;

        // Agregar parámetros extra personalizados
        Object.assign(data, extras);

        gtag("event", nombreEvento, data);
    }
}
