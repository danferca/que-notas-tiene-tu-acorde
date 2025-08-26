// interacciones-globales.js
import { enviarEventoGA } from './gtag-events.js';

/* ============================
   📌 Menú hamburguesa
============================ */
const menuToggle = document.querySelector('.menu-toggle');
const menuLinks = document.getElementById('menu-links');

if (menuToggle && menuLinks) {
    menuToggle.addEventListener('click', () => {
        const activo = menuLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', activo);

        enviarEventoGA('menu_toggle', 'interaccion_usuario', null, null, {
            estado: activo ? 'abierto' : 'cerrado',
            dispositivo: window.innerWidth <= 768 ? 'mobile' : 'desktop'
        });
    });
}

/* ============================
   📌 Clics en enlaces del menú
============================ */
document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        const destino = link.textContent.trim();
        enviarEventoGA("click_menu", "navegacion", destino, null, {
            url: link.getAttribute('href'),
            pagina_origen: location.pathname
        });
    });
});

/* ============================
   📌 Scroll del 50% en páginas largas
============================ */
let scroll50 = false;
window.addEventListener('scroll', () => {
    if (!scroll50 && (window.scrollY + window.innerHeight) >= (document.body.scrollHeight * 0.5)) {
        scroll50 = true;
        enviarEventoGA('scroll_depth', 'lectura', '50%', null, {
            pagina: location.pathname
        });
    }
});

/* ============================
   📌 Clics en redes sociales
============================ */
document.querySelectorAll(".footer-links a").forEach(link => {
    link.addEventListener("click", () => {
        const red = link.getAttribute("aria-label");
        if (red) {
            enviarEventoGA(`click_${red.toLowerCase()}`, "redes_sociales", red);
        }
    });
});
