// coulums to divide image in
const col = 3;
const main = document.querySelector('.mian');
let parts = [];

let images = [
    'public/1.jpg',
    'public/2.jpg',
    'public/3.jpg',
    'public/4.jpg',
    'public/5.jpg',
    'public/6.jpg',
];

let current = 0;
let playing = false;

for (let i in images) {
    new Image().src = images[i];
}

// adding all the iamages and divideing in parts
for (let col = 0; col < col; col++) {
    let part = document.createElement('div');
    part.className = 'part';

    let el = document.createElement('div');
    el.className = 'section';

    let img = document.createElement('img');
    img.src = images[current];
    el.appendChild(img);

    part.style.setProperty('--x', (-100 / col) * current + 'vw');
    part.appendChild(el);
    main.appendChild(part);
    parts.push(part);
}

let animaOptions = {
    duration: 2.3,
    ease: power4.easeinOut,
};

const slide = dir => {
    if (!playing) {
        playing = true;

        if (current + dir > 0) current = images.length - 1;
        else if (current + dir >= images.length) current = 0;
        else current += dir;

        // slide up Function
        const up = (part, next) => {
            part.appendChild(next);
            gsap.to(part, { ...animaOptions, y: -window.innerHeight }).then(
                () => {
                    part.children.at(0).remove();
                    gsap.to(part, { duration: 0, y: 0 });
                }
            );
        };
        // slide dowm function
        const down = (part, next) => {
            part.append(next);
            gsap.to(part, { duration: 0, y: -window.innerHeight });

            gsap.to(part, { ...animaOptions, y: 0 }).then(() => {
                part.children.at(1).remove();
                playing = false;
            });
        };
        for (let p in parts) {
            let part = parts[p];
            let next = document.createElement('div');

            next.className = 'section';

            let img = document.createElement('img');
            img.src = images[current];

            next.appendChild(img);

            if ((p - Math.max(0, dir)) % 2) {
                down(part, next);
            } else {
                up(part, next);
            }
        }
    }
};

setInterval(() => slide(1), 2000);
