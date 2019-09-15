let creatures = [];
let creatureNo = 200;
let wid = 600;
let hei = 600;
let range = 40;

function setup() {
  createCanvas(wid, hei);
  for (let i = 0; i < creatureNo; i++) creatures[i] = new creature(createVector(random(wid), random(hei)), creatures, range);
}

function draw() {
  background(220);
  for (let i = 0; i < creatures.length; i++) {
    creatures[i].update();
    creatures[i].show();
  }
}