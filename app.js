// Bonne pratique : une fonction appelée quand la 
// page est chargée
window.onload = init;

// Variables "globales"
let canvas, ctx;
let couleurTete = "orange";
let xBonhomme = 0, yBonhomme = 100;
let vitesseX = 10, vitesseY = 1;

let bonhomme = {
  couleurTete : "orange",
  x: 0,
  y: 100,
  vitesseX : 10,
  vitesseY : 1,
  angleBrasgauche:0,
  angleAvantBrasGauche: 0.5,
}

function init() {
  console.log("page chargée");
  
  // On récupère dans le DOM le canvas (on ne peut
  // le faire que si le DOM est "ready", c'est-
  // à dire si la page est chargée)
  // parametre = selecteur CSS
  canvas = document.querySelector("#myCanvas");
  
  // on récupère le contexte graphique, qui a des
  // propriétés et des méthodes pour dessiner
  ctx = canvas.getContext("2d");
  
  // On lance l'animation
 animeBonhomme();
  setInterval(changeCouleur, 1000);
}

function changeCouleur() {
  if(bonhomme.couleurTete === "orange") {
    bonhomme.couleurTete = "green";
  } else {
    bonhomme.couleurTete = "orange";
  }
}

function animeBonhomme() {
  // 1 - on efface le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 2 - on dessine dans le canvas
  drawBonhomme(bonhomme.x, bonhomme.y);
  
  // 3 - on met à jour les objets à dessiner
  bonhomme.angleBrasGauche += 0.1;
  bonhomme.x += bonhomme.vitesseX;
  if((bonhomme.x+100 >= canvas.width) || (bonhomme.x <= 0)){
    bonhomme.vitesseX = -bonhomme.vitesseX;
  }
  
  bonhomme.y += bonhomme.vitesseY;
  if((bonhomme.y+100 >= canvas.height) || (bonhomme.y-60 <= 0)){
    bonhomme.vitesseY = -bonhomme.vitesseY;
  }
  
  // 4 - On rapelle 60 fois par seconde la fonction
  requestAnimationFrame(animeBonhomme);
  
}
function drawBonhomme(x, y) {
  // bonne pratique: sauver au début et restaurer le contexte à la fin
  ctx.save();
  
  // x, y, largeur, hauteur. Origine = le coin
  ctx.translate(x, y);
  
  // en haut à gauche
  ctx.fillStyle = "red"; // valeur = une couleur CSS3
  ctx.fillRect(0, 0, 100, 100);
  
  // Le cou et la tête
  dessineCouEtTete();
  
  // Les bras
  dessineBrasGauche();
  
  // deuxième bonne pratique: pour dessiner en x, y, on déplace
  // le repère et on dessine comme si on était en 0, 0
  ctx.restore();
}

function dessineCouEtTete() {
  ctx.save();
  
  // On translate par rapport au repère courant (le corps)
  ctx.translate(35, -20);
    // Le cou
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, 30, 20);
  
  // La tête, je translate par rapport au cou
  ctx.translate(-10, -50);
  ctx.fillStyle=bonhomme.couleurTete;
  ctx.fillRect(0, 0, 50, 50)
  
  ctx.restore();
}



function dessineBrasGauche(angle) {
  ctx.save();
  
  ctx.translate(0, 0);
  ctx.rotate(bonhomme.angleBrasGauche);
  
  ctx.fillStyle="green";
  ctx.fillRect(0, 0, 20, 50);
  
  // Dessin de l'avant bras gauche
  dessineAvantBrasGauche(angle);
  ctx.restore();
}

function dessineAvantBrasGauche(angle) {
  ctx.save();
  
  ctx.translate(10, 40);
  ctx.rotate(bonhomme.angleAvantBrasGauche);
  // Pour changer le point de controle
  ctx.translate(-10, 0);
  
  ctx.fillStyle="violet";
  ctx.fillRect(0, 0, 20, 50);
  ctx.restore();
}