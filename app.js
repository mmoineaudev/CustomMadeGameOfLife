/**
 * Author : Maxime MOINEAU - L3
 * Game Of Life
 * Pour le cours d'animation de M. Buffa
 * Sources : https://stackoverflow.com/questions/96626/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
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
    WIDTH = 30; HEIGHT=30;
    gamemap = new AgingGameMap(canvas, context, WIDTH, HEIGHT);
    animegamemap();
}


function resetLogicalMap(){
    gamemap.initLogicalMap();
    gamemap.populate();
}

function setAgingMap(){
    gamemap = new AgingGameMap(canvas, context, WIDTH, HEIGHT);
}

function animegamemap(timeElapsed){
    //debug("animegamemap");
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
 * 
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
        this.context.translate(3,3);
        this.context.fillStyle = color;
        this.context.fillRect(this.x*10,this.y*10, 1*10, 1*10);
        this.context.fill();
        this.context.restore();
        //debug("drawLifeForm("+this.x*10+";"+this.y*10+")");
    }
    
    die(){
        this.context.save();
        this.context.translate(3,3);
        this.context.fillStyle = "black";
        this.context.fillRect(this.x*10,this.y*10, 1, 1);
        this.context.fill();
        this.context.restore();
    }
    
    printInfos(){
        debug("FOL("+this.x*10+";"+this.y*10+");\n");
    }
    
}

class AgingFormOfLife extends FormOfLife{
    constructor(x, y, context){
        
        super(x,y,context);
        this.age=0;
    }
    
    drawLifeForm(color){
        this.context.save();
        this.context.translate(3,3);
        this.context.fillStyle = color;
        this.context.fillRect(this.x*10,this.y*10, 1*10, 1*10);
        this.context.fill();
        this.context.restore();
        debug("!!!drawALifeForm("+this.age+")");
    }
    getAge(){
        return this.age;
    }
    ages(){
        this.age++;
    }
    
    die(){
        super.die();
        this.age=0;
    }
    
    printInfos(){
        debug("AFOL("+this.x*10+";"+this.y*10+");\n");
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
        this.populate();
        debug("I am a map("+this.WIDTH+";"+this.HEIGHT+"), this is what I do :"); 
        
    }
    initLogicalMap(){
        this.map = createArray(this.WIDTH, this.HEIGHT);
    }
    
    drawMap(){
        
        this.context.save();
        //on dessine en x,y, on veut un repere relatif
        this.context.translate(3,3);
        this.context.fillStyle = "black";
        this.context.fillRect(0,0, this.WIDTH*10, this.HEIGHT*10);
        this.context.fill();
        this.context.restore();
        
    }
    
    populate(){
        for(var x=0; x<this.WIDTH; x++){
            for(var y=0; y<this.HEIGHT; y++){
                //let us try a more random approach to be overriden
                if(Math.random()>0.9){
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
                this.reproduce(x,y, getRandomColor());
            }
        }
    }
    
    kill(x,y){
        debug("kill " +x +";"+ y)
        if(this.map[x][y]!=null)
            (this.map[x][y]).die();
        this.map[x][y]=null;
    }
    
    reproduce(x,y, color){
       
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
        //debug("Voisins de "+x+";"+y+ " : "+neighbourNb+"\n");
        return neighbours;
    }
}
class AgingGameMap extends GameMap{
    constructor(canvas, context, WIDTH, HEIGHT){	       
        super(canvas, context, WIDTH, HEIGHT);		        
        debug("I am a aging map("+this.WIDTH+";"+this.HEIGHT+"), this is what I do :"); 
    }
    populate(){
        for(var x=0; x<this.WIDTH; x++){
            for(var y=0; y<this.HEIGHT; y++){
                if(true){
               	   debug("new AFOL - population");
                    this.map[x][y] = new AgingFormOfLife(x, y, this.context);
                }else{
                    continue;
                }
            }
        } 
    }
    live(x,y){
        //debug("live "+ x+";"+y)
        if(this.map[x][y] instanceof AgingFormOfLife) {
            
            this.map[x][y].ages();
            debug("AFOL lives and ages : "+ this.map[x][y].getAge());
       
            if(this.map[x][y].getAge()>9) { //isolation or age
                this.kill(x,y);
            }else{
                if(this.getNeighbours>3){//overpopulation
                    this.kill(x,y);
                }else{//reproduction
                    var color="#"+this.map[x][y].getAge()+"FFFFF";
                    //debug("AFOL color : "+color);
                    this.reproduce(x,y, color);
                }
            }
        }
    }
}

