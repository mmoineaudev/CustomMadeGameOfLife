

//TODO still.... Utiliser au moins 3 ou 4 elements input de HTML5 (color, range, number par exemple) pour paramétrer votre jeu (vitesse, taille, nombre, couleur etc)


window.onload=init;
let canvas1, context, gamemap;

function debug(f){
  console.log("debug : "+f);
}


function init(){
  //est-il possible d'utiliser le meme canvas pour un objet autre sans que l'anim du premier ne l'écrase  ? 
  canvas1 = document.querySelector("#canvas1");

  context = canvas1.getContext("2d");

  gamemap = new GameMap(context, WIDTH, HEIGHT);
  //bonhomme2 = new Bonhomme(100,100,canvas2,context2, 0.3, color1_b2, color2_b2, color3_b2);

  animegamemap();

}


//comment ne pas faire de redondance ici ?
function animegamemap(timeElapsed){
    gamemap.contexte.clearRect(0, 0, gamemap.canvas.width, gamemap.canvas.height);
  
    gamemap.drawMap();

    requestAnimationFrame(animegamemap);

    
};

//fonctions utilitaires
function accelerate_b1(){
  //TODO
  ;
}
function decelerate_b1(){
  //TODO
  ;
}
/**
* this is magic :
* syntax : 
* createArray();     // [] or new Array()
* createArray(2);    // new Array(2)
* createArray(3, 2); // [new Array(2),
*                    //  new Array(2),
*                    //  new Array(2)]

*/
function createArray(length) {
//https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}



/**
* maybe useful later
*/
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//Classes

class FormOfLife{ //en ES6
    
    constructor(x, y, canvas, contexte){
     debug("I am a form of life");
  }
  
}
/**
* GameMap is meant to possess the bidimensionnal array and the drawLMap Method
*/
class GameMap{
  
  constructor(context, WIDTH, HEIGHT){
    this.context=context;
    this.WIDTH=WIDTH;
    this.HEIGHT=HEIGHT;
    debug("I am a map");

  }

  function drawMap(){
    //TODO
  }
}
