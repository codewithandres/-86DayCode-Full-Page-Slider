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

