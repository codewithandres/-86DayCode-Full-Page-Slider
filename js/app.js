// Número de columnas en la galería
const cols = 3;
// Elemento principal donde se insertarán las imágenes
const main = document.getElementById('main');
// Fragmento de documento para evitar múltiples reflows
const fragment = document.createDocumentFragment();
// Contenedor de los botones de navegación
const containerButtons = document.querySelector('.buttons');

// Variables para manejar las partes de la galería y el estado actual
let parts = [],
    current = 0,
    playing = false;

// URLs de las imágenes a mostrar
let images = [
    'https://res.cloudinary.com/andresdev/image/upload/v1725826281/tb0dehgkcgvgbcxpjo6b.jpg',
    'https://res.cloudinary.com/andresdev/image/upload/v1725826151/pekiqije05fvmc7ka3vk.jpg',
    'https://res.cloudinary.com/andresdev/image/upload/v1725826255/fd946ruhb3awf0cvheue.jpg',
    'https://res.cloudinary.com/andresdev/image/upload/v1725826251/geg2whybtifvj1bmg7wk.jpg',
    'https://res.cloudinary.com/andresdev/image/upload/v1725826249/nor1btxouxggu0rmz0lo.jpg',
    'https://res.cloudinary.com/andresdev/image/upload/v1725826159/en2f0zoogmxto2mzkfg9.jpg',
];

// Precargar las imágenes
for (let i in images) {
    new Image().src = images[i];
}

// Crear las columnas y añadir las imágenes iniciales
for (let col = 0; col < cols; col++) {
    let part = document.createElement('div');
    part.classList.add('part');

    let el = document.createElement('div');
    el.classList.add('section');

    let img = document.createElement('img');
    img.src = images[current];

    el.appendChild(img);
    part.style.setProperty('--x', (-100 / cols) * col + 'vw');

    fragment.appendChild(el);
    main.appendChild(part);
    parts.push(part);
    part.appendChild(fragment);
}

// Opciones de animación
const animOptions = {
    duration: 2.3,
    ease: Power4.easeInOut,
};

// Función para cambiar de imagen
const go = dir => {
    if (!playing) {
        playing = true;

        // Actualizar el índice de la imagen actual
        if (current + dir < 0) current = images.at(-1);
        else if (current + dir >= images.length) current = 0;
        else current += dir;

        // Función para animar hacia arriba
        const up = (part, next) => {
            part.appendChild(next);
            gsap.to(part, { ...animOptions, y: -window.innerHeight }).then(
                () => {
                    part.children[0].remove();
                    gsap.to(part, { duration: 0, y: 0 });
                }
            );
        };

        // Función para animar hacia abajo
        const down = (part, next) => {
            part.prepend(next);
            gsap.to(part, { duration: 0, y: -window.innerHeight });
            gsap.to(part, { ...animOptions, y: 0 }).then(() => {
                part.children[1].remove();
                playing = false;
            });
        };

        // Aplicar la animación a cada parte
        for (let p in parts) {
            let part = parts[p],
                next = document.createElement('div');
            next.classList.add('section');

            let img = document.createElement('img');
            img.src = images[current];

            next.appendChild(img);

            (p - Math.max(0, dir)) % 2 ? down(part, next) : up(part, next);
        }
    }
};

// setInterval(function () {
//   go(1);
// }, 2000);

// Añadir evento para detectar teclas de flecha y cambiar la imagen
window.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) go(1);
    else if (['ArrowUp', 'ArrowLeft'].includes(event.key)) go(-1);
});

// Función de interpolación lineal
const lerp = (start, end, amount) => (1 - amount) * start + amount * end;

// Crear elementos para el cursor personalizado
const cursor = document.createElement('div');
cursor.classList.add('cursor');

const cursorF = document.createElement('div');
cursorF.classList.add('cursor-f');

// Variables para la posición del cursor
let cursorX = 0,
    cursorY = 0,
    pageX = 0,
    pageY = 0,
    size = 8,
    sizeF = 36,
    followSpeed = 0.16;

// Añadir los cursores al cuerpo del documento
document.body.appendChild(cursor);
document.body.appendChild(cursorF);

// Ocultar el cursor en dispositivos táctiles
if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    cursorF.style.display = 'none';
}

// Establecer el tamaño de los cursores
cursor.style.setProperty('--size', size + 'px');
cursorF.style.setProperty('--size', sizeF + 'px');

// Actualizar la posición del cursor en movimiento del ratón
window.addEventListener('mousemove', event => {
    pageX = event.clientX;
    pageY = event.clientY;
    cursor.style.left = event.clientX - size / 2 + 'px';
    cursor.style.top = event.clientY - size / 2 + 'px';
});

// Función de bucle para animar el cursor de seguimiento
const loop = () => {
    cursorX = lerp(cursorX, pageX, followSpeed);
    cursorY = lerp(cursorY, pageY, followSpeed);

    cursorF.style.top = cursorY - sizeF / 2 + 'px';
    cursorF.style.left = cursorX - sizeF / 2 + 'px';

    requestAnimationFrame(loop);
};

loop();

// Variables para manejar el arrastre del ratón
let startY,
    endY,
    clicked = false;

// Función para manejar el evento de mousedown
const mousedown = event => {
    gsap.to(cursor, { scale: 4.5 });
    gsap.to(cursorF, { scale: 0.4 });

    clicked = true;
    startY =
        event.clientY ||
        event.touches[0].clientY ||
        event.targetTouches[0].clientY;
};

// Función para manejar el evento de mouseup
const mouseup = event => {
    gsap.to(cursor, { scale: 1 });
    gsap.to(cursorF, { scale: 1 });

    endY = event.clientY || endY;
    if (clicked && startY && Math.abs(startY - endY) >= 40) {
        go(!Math.min(0, startY - endY) ? 1 : -1);

        clicked = false;
        startY = null;
        endY = null;
    }
};

// Añadir eventos para mousedown y touchstart
window.addEventListener('mousedown', mousedown, false);
window.addEventListener('touchstart', mousedown, false);

// Manejar el movimiento táctil
window.addEventListener(
    'touchmove',
    event => {
        if (clicked)
            endY =
                event.touches.at(0).clientY ||
                event.targetTouches.at(0).clientY;
    },
    false
);

// Añadir eventos para touchend y mouseup
window.addEventListener('touchend', mouseup, false);
window.addEventListener('mouseup', mouseup, false);

// Variable para manejar el tiempo de espera del scroll
let scrollTimeout;

// Función para manejar el evento de la rueda del ratón
const wheel = event => {
    clearTimeout(scrollTimeout);

    setTimeout(() => {
        if (event.deltaY < -40) go(-1);
        else if (event.deltaY >= 40) go(1);
    });
};

// Añadir eventos para la rueda del ratón
window.addEventListener('mousewheel', wheel, false);
window.addEventListener('wheel', wheel, false);

// Añadir evento para los botones de navegación
containerButtons.addEventListener('click', ({ target }) => {
    if (target.closest('[data-next]')) go(-1);

    if (target.closest('[data-prev]')) go(1);
});
