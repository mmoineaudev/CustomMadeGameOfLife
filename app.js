/**
* Author : Maxime MOINEAU - L3
* Game Of Life
* Pour le cours d'animation de M. Buffa
* Sources : https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
* https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
* https://www.youtube.com/watch?v=x5n5QlxLzLU
*/

//************************

window.onload=init;
let canvas, context, gamemap;

function debug(f){
  console.log("debug : "+f);
}


function init(){
  canvas = document.querySelector("#html_canvas");
  context = canvas.getContext("2d");
  WIDTH = 100; HEIGHT=100;
  gamemap = new GameMap(canvas, context, WIDTH, HEIGHT);
  //animegamemap();
}


function animegamemap(timeElapsed){
    gamemap.context.clearRect(0, 0, gamemap.canvas.width, gamemap.canvas.height);
    gamemap.drawMap();
    requestAnimationFrame(animegamemap);

}


//************************
//fonctions utilitaires
//************************

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

//************************
//Classes
//************************


/**
* FormOfLife is a dot
*/
class FormOfLife{ //en ES6
    
    constructor(x, y, context){
     this.x=x;
     this.y=y;
     this.context=context;
     
    }

    drawLifeForm(){
      this.context.save();
      this.context.translate(75,75);
      this.context.fillStyle = "white";
      this.context.fillRect(this.x,this.y, 1, 1);
      this.context.fill();
      this.context.restore();
      this.printInfos();
    }

    die(){
      this.context.save();
      this.context.translate(75,75);
      this.context.fillStyle = "black";
      this.context.fillRect(this.x,this.y, 1, 1);
      this.context.fill();
      this.context.restore();
    }

    printInfos(){
      debug("FOL("+this.x+";"+this.y+");\n");
    }
  
}
/**
* GameMap is meant to possess the bidimensionnal array and the drawLMap Method
*/
class GameMap{
  
  constructor(canvas, context, WIDTH, HEIGHT){
    this.canvas = canvas;
    this.context=context;
    this.WIDTH=WIDTH;
    this.HEIGHT=HEIGHT;
    this.map = createArray(this.WIDTH, this.HEIGHT);
    this.initLogicalMap();

    debug("I am a map("+this.WIDTH+";"+this.HEIGHT+"), this is what I do :");
    this.drawMap();
    

  }
  initLogicalMap(){
    debug("populate start");
    this.populate();
    debug("populate end");

  }


  drawMap(){
    debug("drawMap start");
    this.context.save();
    //on dessine en x,y, on veut un repere relatif
    this.context.translate(75,75);
    this.context.fillStyle = "black";
    this.context.fillRect(0,0, this.WIDTH, this.HEIGHT);
    this.context.fill();
    this.context.restore();
    this.drawLogicalMap();
    debug("drawMap end");
  }

  populate(){
    for(var x=0; x<this.WIDTH; x++){
      for(var y=0; y<this.HEIGHT; y++){
        this.map[x][y] = new FormOfLife(x, y, this.context);
      }
    } 
  }

  drawLogicalMap(){
    for(var x =0; x<this.WIDTH;x++){
      for(var y =0; y<this.HEIGHT;y++){
        if(this.map[x][y]){//populate all the map
          this.map[x][y].drawLifeForm();
        }
      }
    }
  }
  lifeGoesOn(){
    for(var x =0; x<this.WIDTH;x++){
      for(var y =0; y<this.HEIGHT;y++){
        if(this.map[x][y]){//populate all the map
          live(x,y);
        }
      }
    }
  }
  // And @author created life 

  live(x,y){
    if(this.isAlone(x,y)){//isolation
      this.kill(x,y);
    }else{
      if(getNeighbours>2){//overpopulation
        this.kill(x,y);
      }else{//reproduction
        this.reproduce(x,y);
      }
    }
  }

  kill(x,y){
    this.map[x][y].die();
  }

  reproduce(x,y){
    if(!this.map[x-1][y]){
      this.map[x-1][y] = new FormOfLife(x-1, y, this.context);
      this.map[x-1][y].drawLifeForm();
      
    }
    if(!this.map[x+1][y]){
      this.map[x+1][y] = new FormOfLife(x+1, y, this.context);
      this.map[x+1][y].drawLifeForm();
    }
    if(!this.map[x][y-1]){
      this.map[x][y-1] = new FormOfLife(x, y-1, this.context);
      this.map[x][y-1].drawLifeForm();
    }
    if(!this.map[x][y+1]){
      this.map[x][y+1] = new FormOfLife(x, y+1, this.context);
      this.map[x][y+1].drawLifeForm();
    }
  }

  //outils pour se repérer relativement



  isAlone(x, y){
    if(this.map[x-1][y]||this.map[x+1][y]||this.map[x][y-1]||this.map[x][y+1]) return false;
    else return true;
  }

   getNeighbours(x, y){
    var neighbourNb = 0;
    var neighbours = array();
    if(this.map[x-1][y]){
      neighbours[neighbourNb++]=this.map[x-1, y];
    }
    if(this.map[x+1][y]){
      neighbours[neighbourNb++]=this.map[x+1, y];
    }
    if(this.map[x][y-1]){
      neighbours[neighbourNb++]=this.map[x, y-1];
    }
    if(this.map[x][y+1]){
      neighbours[neighbourNb++]=this.map[x, y+1];
    }
    debug("Voisins de "+x+";"+y+ " : "+neighbourNb+"\n");
    return neighbours;
  }
}
