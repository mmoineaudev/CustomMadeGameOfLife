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

function resetLogicalMap(){
  gamemap.initLogicalMap();
  gamemap.populate();
}
function init(){
  canvas = document.querySelector("#html_canvas");
  context = canvas.getContext("2d");
  WIDTH = 10; HEIGHT=5;
  gamemap = new GameMap(canvas, context, WIDTH*10, HEIGHT*10);
 
  animegamemap();
}


function animegamemap(timeElapsed){
    debug("animegamemap");
    gamemap.context.clearRect(0, 0, gamemap.canvas.width, gamemap.canvas.height);
    gamemap.drawMap();
    gamemap.lifeGoesOn();
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
     this.printInfos();
    }

    drawLifeForm(color){
      this.context.save();
      this.context.translate(25,25);
      this.context.fillStyle = color;
      this.context.fillRect(this.x*10,this.y*10, 1*10, 1*10);
      this.context.fill();
      this.context.restore();
      debug("drawLifeForm("+this.x*10+";"+this.y*10+")");
    }

    die(){
      this.context.save();
      this.context.translate(25,25);
      this.context.fillStyle = "black";
      this.context.fillRect(this.x*10,this.y*10, 1, 1);
      this.context.fill();
      this.context.restore();
    }

    printInfos(){
      debug("FOL("+this.x*10+";"+this.y*10+");\n");
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
    this.initLogicalMap();
    this.populate2();
    debug("I am a map("+this.WIDTH+";"+this.HEIGHT+"), this is what I do :"); 

  }
  initLogicalMap(){
    this.map = createArray(this.WIDTH, this.HEIGHT);
    debug("populate start");
    debug("populate end");
  }


  drawMap(){
    debug("drawMap start");
    this.context.save();
    //on dessine en x,y, on veut un repere relatif
    this.context.translate(25,25);
    this.context.fillStyle = "black";
    this.context.fillRect(0,0, this.WIDTH*10, this.HEIGHT*10);
    this.context.fill();
    this.context.restore();
    debug("drawMap end");
  }

  populate(){
    for(var x=0; x<this.WIDTH; x++){
      for(var y=0; y<this.HEIGHT; y++){
        if(x>this.WIDTH/4&&x<3*this.WIDTH/4 && y>this.HEIGHT/4 && y < 3*this.HEIGHT/4){
          this.map[x][y] = new FormOfLife(x, y, this.context);
        }else{
          continue;
        }
      }
    } 
  }
  populate2(){
    for(var x=0; x<this.WIDTH; x++){
      for(var y=0; y<this.HEIGHT; y++){
        if(x+y<(this.WIDTH+this.HEIGHT)/2){
          this.map[x][y] = new FormOfLife(x, y, this.context);
        }else{
          continue;
        }
      }
    } 
  }

  lifeGoesOn(){
    for(var x =0; x<this.WIDTH;x++){
      for(var y =0; y<this.HEIGHT;y++){
        if(this.map[x][y]){//populate all the map
          this.live(x,y);
        }
      }
    }
  }
  // And @author created life 

  live(x,y){
    debug("live "+ x+";"+y)
    if(this.isAlone(x,y)){//isolation
      this.kill(x,y);
    }else{
      if(this.getNeighbours>2){//overpopulation
        this.kill(x,y);
      }else{//reproduction
        this.reproduce(x,y);
      }
    }
  }

  kill(x,y){
    debug("kill " +x +";"+ y)
    if(this.map[x][y]!=null)
      (this.map[x][y]).die();
    this.map[x][y]=null;
  }

  reproduce(x,y){
    var color = getRandomColor();
    if(x>0 && !this.map[x-1][y]){
      this.map[x-1][y] = new FormOfLife(x-1, y, this.context);
      this.map[x-1][y].drawLifeForm(color);
      
    }else
    if(x<this.WIDTH-1&&!this.map[x+1][y]){
      this.map[x+1][y] = new FormOfLife(x+1, y, this.context);
      this.map[x+1][y].drawLifeForm(color);
    }else
    if(y>1&&!this.map[x][y-1]){
      this.map[x][y-1] = new FormOfLife(x, y-1, this.context);
      this.map[x][y-1].drawLifeForm(color);
    }else
    if(y<this.HEIGHT-1&&!this.map[x][y+1]){
      this.map[x][y+1] = new FormOfLife(x, y+1, this.context);
      this.map[x][y+1].drawLifeForm(color);
    }
  }

  //outils pour se repérer relativement



  isAlone(x, y){
    if(x>0&&!this.map[x-1][y]){
      return false;
    }else
    if(x<this.WIDTH-1 &&! this.map[x+1][y]){
      return false;
    }else
    if(y>1&&!this.map[x][y-1]){
      return false;
    }else
    if(y<this.HEIGHT+1&&!this.map[x][y+1]){
      return false;
    }
    else return true;
  }

   getNeighbours(x, y){
    var neighbourNb = 0;
    var neighbours = array();
    if(x>0&&!this.map[x-1][y]){
      neighbours[neighbourNb++]=this.map[x-1, y];
    }
    if(x<this.WIDTH+1&&!this.map[x+1][y]){
      neighbours[neighbourNb++]=this.map[x+1, y];
    }
    if(y>1&&!this.map[x][y-1]){
      neighbours[neighbourNb++]=this.map[x, y-1];
    }
    if(y<this.HEIGHT+1&&!this.map[x][y+1]){
      neighbours[neighbourNb++]=this.map[x, y+1];
    }
    debug("Voisins de "+x+";"+y+ " : "+neighbourNb+"\n");
    return neighbours;
  }
}
