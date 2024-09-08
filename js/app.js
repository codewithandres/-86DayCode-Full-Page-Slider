const cols = 3;
const main = document.getElementById('main');
const fragment = document.createDocumentFragment();

let parts = [],
    current = 0,
    playing = false;

let images = [
    './public/1.jpg',
    './public/2.jpg',
    './public/3.jpg',
    './public/4.jpg',
    './public/5.jpg',
];

for (let i in images) {
    new Image().src = images[i];
}

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
const animOptions = {
    duration: 2.3,
    ease: Power4.easeInOut,
};

const go = dir => {
    if (!playing) {
        playing = true;

        if (current + dir < 0) current = images.at(-1);
        else if (current + dir >= images.length) current = 0;
        else current += dir;

        const up = (part, next) => {
            part.appendChild(next);
            gsap.to(part, { ...animOptions, y: -window.innerHeight }).then(
                () => {
                    part.children[0].remove();
                    gsap.to(part, { duration: 0, y: 0 });
                }
            );
        };

        const down = (part, next) => {
            part.prepend(next);
            gsap.to(part, { duration: 0, y: -window.innerHeight });
            gsap.to(part, { ...animOptions, y: 0 }).then(() => {
                part.children[1].remove();
                playing = false;
            });
        };

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

window.addEventListener('keydown', function (e) {
    if (['ArrowDown', 'ArrowRight'].includes(e.key)) go(1);
    else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) go(-1);
});

const lerp = (start, end, amount) => (1 - amount) * start + amount * end;

const cursor = document.createElement('div');
cursor.classList.add('cursor');

const cursorF = document.createElement('div');
cursorF.classList.add('cursor-f');

let cursorX = 0,
    cursorY = 0,
    pageX = 0,
    pageY = 0,
    size = 8,
    sizeF = 36,
    followSpeed = 0.16;

document.body.appendChild(cursor);
document.body.appendChild(cursorF);

if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    cursorF.style.display = 'none';
}

cursor.style.setProperty('--size', size + 'px');
cursorF.style.setProperty('--size', sizeF + 'px');

window.addEventListener('mousemove', event => {
    pageX = event.clientX;
    pageY = event.clientY;
    cursor.style.left = event.clientX - size / 2 + 'px';
    cursor.style.top = event.clientY - size / 2 + 'px';
});

const loop = () => {
    cursorX = lerp(cursorX, pageX, followSpeed);
    cursorY = lerp(cursorY, pageY, followSpeed);

    cursorF.style.top = cursorY - sizeF / 2 + 'px';
    cursorF.style.left = cursorX - sizeF / 2 + 'px';

    requestAnimationFrame(loop);
};

loop();

let startY,
    endY,
    clicked = false;

const mousedown = event => {
    gsap.to(cursor, { scale: 4.5 });
    gsap.to(cursorF, { scale: 0.4 });

    clicked = true;
    startY =
        event.clientY ||
        event.touches[0].clientY ||
        event.targetTouches[0].clientY;
};
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
window.addEventListener('mousedown', mousedown, false);
window.addEventListener('touchstart', mousedown, false);
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
window.addEventListener('touchend', mouseup, false);
window.addEventListener('mouseup', mouseup, false);

let scrollTimeout;

const wheel = event => {
    clearTimeout(scrollTimeout);

    setTimeout(() => {
        if (event.deltaY < -40) go(-1);
        else if (event.deltaY >= 40) go(1);
    });
};
window.addEventListener('mousewheel', wheel, false);
window.addEventListener('wheel', wheel, false);
