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
const GROSSISSEMENT = 10;
const MAX_AGE = 3;
var autoOn = false;
var alive = 0;
let canvas, context, gamemap;

function debug(f){
    console.log("debug : "+f);
}

function init(){
    canvas = document.querySelector("#html_canvas");
    context = canvas.getContext("2d");
    WIDTH = 50; HEIGHT=50;
    gamemap = new GameMap(canvas, context, WIDTH, HEIGHT);
    nextStep();
}


function resetLogicalMap(){
    gamemap.populate();
    nextStep();
    setAnimationOff();
    alive=0;
}

function setAgingMap(){
    gamemap = new AgingGameMap(canvas, context, WIDTH, HEIGHT);
    resetLogicalMap();
}

function setClassicMap(){
    gamemap = new GameMap(canvas, context, WIDTH, HEIGHT);
    resetLogicalMap();
}

function setParanormalMap(){
    gamemap = new ParanormalGameMap(canvas, context, WIDTH, HEIGHT);
    resetLogicalMap();

}

function nextStep(){
    gamemap.context.clearRect(0, 0, WIDTH*GROSSISSEMENT, HEIGHT*GROSSISSEMENT);
    gamemap.drawMap();
    gamemap.lifeGoesOn();
    displayAliveNumber();
}
function setAnimationOn(){
    autoOn=true;
}
function setAnimationOff(){
    autoOn=false;
}
function displayAliveNumber(){
    document.getElementById("alive").innerHTML='total FOL since the beginning :'+alive;
}
function animegamemap(timeElapsed){
    nextStep();
    (autoOn)?requestAnimationFrame(animegamemap):debug("animation off");   
 }


//************************
//fonctions utilitaires
//************************

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
class FormOfLife{
    
    constructor(x, y, context){
        this.x=x;
        this.y=y;
        this.context=context;
        //this.printInfos();
    }
    
    drawLifeForm(color){
        this.context.save();
        this.context.translate(0,0);
        this.context.fillStyle = color;
        this.context.fillRect(this.x,this.y, 1*GROSSISSEMENT, 1*GROSSISSEMENT);
        this.context.fill();
        this.context.restore();
    }
    
    die(){
        this.context.save();
        this.context.translate(0,0);
        this.context.fillStyle = "black";
        this.context.fillRect(this.x,this.y, 1*GROSSISSEMENT, 1*GROSSISSEMENT);
        this.context.fill();
        this.context.restore();
    }
    
    printInfos(){
        //debug("FOL("+this.x+";"+this.y+");\n");
    }
    
}

class AgingFormOfLife extends FormOfLife{
    constructor(x, y, context){
        super(x,y,context);
        this.age=0;
        
    }
    
    drawALifeForm(color){
        //debug("drawing :"+this.x+";" + this.y +" ;");
        this.context.save();
        this.context.translate(0,0);
        this.context.fillStyle = color;
        this.context.fillRect(this.x,this.y, 1*GROSSISSEMENT, 1*GROSSISSEMENT);
        this.context.fill();
        this.context.restore();
    }
    getAge(){
        return this.age;
    }
    ages(){
        this.age++;
    }
    
    die(){
        this.age=0;
        super.die();
        
    }
    
    printInfos(){
        //debug("AFOL("+this.x+";"+this.y+");\n");
    }
    
}
class ParanormalFormOfLife extends FormOfLife{
    constructor(x, y, context){
        super(x,y,context);
        this.facteur=Math.random()*(x+y);//the paranormal factor
        
    }
    
    drawPLifeForm(color){
        this.context.save();
        this.context.translate(0,0);
        this.context.fillStyle = color;
        this.context.fillRect(this.x,this.y, 1*GROSSISSEMENT, 1*GROSSISSEMENT);
        this.context.fill();
        this.context.restore();
    }

   getColor(){
        var color = '#'+Math.floor(this.facteur);
        var res = color;
        if(color.length<7){
            for(var i=7-color.length; i>0; i--)
                res+='F';
        }
        return res;
    }

    getFacteur(){
        return Math.floor(this.facteur);
    }


    die(){  
        super.die();
        this.context.save();
        this.context.translate(0,0);
        this.context.fillStyle = "darkred";
        this.context.fillRect(this.x,this.y, 1*GROSSISSEMENT, 1*GROSSISSEMENT);
        this.context.fill();
        this.context.restore();
    }
    
    printInfos(){
        //debug("AFOL("+this.x+";"+this.y+");\n");
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
        
    }
    initLogicalMap(){
        this.map = createArray(this.WIDTH, this.HEIGHT);
    }
    
    drawMap(){
        
        this.context.save();
        //on dessine en x,y, on veut un repere relatif
        this.context.translate(0,0);
        this.context.fillStyle = "black";
        this.context.fillRect(0,0, this.WIDTH*GROSSISSEMENT, this.HEIGHT*GROSSISSEMENT);
        this.context.fill();
        this.context.restore();
        
    }
    
    spawnAt(){
        //TODO !
    }

    populate(){
        for(var x=0; x<this.WIDTH; x++){
            for(var y=0; y<this.HEIGHT; y++){
                //let us try a more random approach to be overriden
                if(Math.random()>0.95){
                    this.map[x][y] = new FormOfLife(x*GROSSISSEMENT, y*GROSSISSEMENT, this.context);
                }else{
                    continue;
                    
                }
            }
        } 
    }
    
    lifeGoesOn(){
        for(var x =0; x<this.WIDTH;x++){
            for(var y =0; y<this.HEIGHT;y++){
                if(this.map[x][y]){
                    this.live(x,y);
                }
            }
        }
    }
    
    // And @author created life 
    live(x,y){
        if(this.isAlone(x,y)){//isolation
            //debug("isolation");
            
            this.kill(x,y);
        }else{
            if(this.getNeighbours > 3){//overpopulation
                //debug("overpopulation");
                this.kill(x,y);
                

            }else{//reproduction
                //debug("reproduction");
                this.reproduce(x,y, getRandomColor());
            }
        }
    }
    
    kill(x,y){
        ////debug("kill " +x +";"+ y)
        if(this.map[x][y]!=null)
            (this.map[x][y]).die();
        this.map[x][y]=null;
    }
    
    reproduce(x,y, color){
        alive++;
       
        if(x>0 && !this.map[x-1][y]){
            this.map[x-1][y] = new FormOfLife((x-1)*GROSSISSEMENT, y*GROSSISSEMENT, this.context);
            this.map[x-1][y].drawLifeForm(color);
            
        }else
            if(x<this.WIDTH-1&&!this.map[x+1][y]){
                this.map[x+1][y] = new FormOfLife((x+1)*GROSSISSEMENT, y*GROSSISSEMENT, this.context);
                this.map[x+1][y].drawLifeForm(color);
            }else
                if(y>1&&!this.map[x][y-1]){
                    this.map[x][y-1] = new FormOfLife(x*GROSSISSEMENT, (y-1)*GROSSISSEMENT, this.context);
                    this.map[x][y-1].drawLifeForm(color);
                }else
                    if(y<this.HEIGHT-1&&!this.map[x][y+1]){
                        this.map[x][y+1] = new FormOfLife(x*GROSSISSEMENT, (y+1)*GROSSISSEMENT, this.context);
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
        var neighbours = [];
    if(this.map[x][y]){
        if(x>0 && this.map[x-1][y] instanceof FormOfLife){
            neighbours[neighbourNb++]=this.map[x-1][y];
        }
        if(x<this.WIDTH-1 && this.map[x+1][y] instanceof FormOfLife){
            neighbours[neighbourNb++]=this.map[x+1][y];
        }
        
        if(y>0 && this.map[x][y-1] instanceof FormOfLife){
            neighbours[neighbourNb++]=this.map[x][y-1];
        }
        if(y<this.HEIGHT-1 && this.map[x][y+1] instanceof FormOfLife){
            neighbours[neighbourNb++]=this.map[x][y+1];
        }
    }
        //debug("Voisins de "+x+";"+y+ " : "+neighbourNb+"\n");
        return neighbourNb;
    }
}

/**
 * AgingGameMap 
 **/
class AgingGameMap extends GameMap{


    constructor(canvas, context, WIDTH, HEIGHT){	       
        super(canvas, context, WIDTH, HEIGHT);	
        this.initLogicalMap();
        this.populate();
        this.canReproduce = 0;
        //debug("AGINGMAP"); 
    }
    populate(){
        this.drawMap();
        for(var x=0; x<this.WIDTH; x++){
            for(var y=0; y<this.HEIGHT; y++){
                 if(Math.random()>0.9){
                    this.map[x][y] = new AgingFormOfLife(x*GROSSISSEMENT, y*GROSSISSEMENT, this.context);
                    this.map[x][y].drawALifeForm("green");
                 }continue;
            }
        } 
    }
    lifeGoesOn(){
        for(var x =0; x<this.WIDTH;x++){
            for(var y =0; y<this.HEIGHT;y++){
                if(this.map[x][y]){
                    this.live(x,y);
                }
            }
        }
    }
    
    live(x,y){
        ////debug("live "+ x+";"+y)
        if(this.map[x][y] instanceof AgingFormOfLife) {
            this.map[x][y].ages();       
           // var color="#"+this.map[x][y].getAge()+"FFFFF";
            var color= "green";
            if(this.map[x][y].getAge()==1)
                color= "#0099ff";

            if(this.map[x][y].getAge()==2)
                color= "#9933ff";

            if(this.map[x][y].getAge()==3)
                color= "#ff6600";

            this.map[x][y].drawALifeForm(color);
            if(this.map[x][y].getAge()>MAX_AGE) { //or age
                //debug("age");
        
                this.kill(x,y);
            }else{
                if(this.getNeighbours >=2){//overpopulation
                    //debug("overpopulation");
        
                    this.kill(x,y);
                }else{//reproduction
                    //debug("reproduction");
                   if(this.canReproduce++%MAX_AGE==0){//too much AFOLs !
                        this.reproduce(x,y, "red");
                    }
                }
            }
        }
    }

    
    reproduce(x,y, color){
    alive++;     
        if(x>0 && !this.map[x-1][y]){
            this.map[x-1][y] = new AgingFormOfLife((x-1)*GROSSISSEMENT, y*GROSSISSEMENT, this.context);
            this.map[x-1][y].drawALifeForm(color);
        }else
            if(x<this.WIDTH-1&&!this.map[x+1][y]){
                this.map[x+1][y] = new AgingFormOfLife((x+1)*GROSSISSEMENT, y*GROSSISSEMENT, this.context);
                this.map[x+1][y].drawALifeForm(color);
            }else
                if(y>1&&!this.map[x][y-1]){
                    this.map[x][y-1] = new AgingFormOfLife(x*GROSSISSEMENT, (y-1)*GROSSISSEMENT, this.context);
                    this.map[x][y-1].drawALifeForm(color);
                }else
                    if(y<this.HEIGHT-1&&!this.map[x][y+1]){
                        this.map[x][y+1] = new AgingFormOfLife(x*GROSSISSEMENT, (y+1)*GROSSISSEMENT, this.context);
                        this.map[x][y+1].drawALifeForm(color);

        }
    }
    
}

/**
 * AgingGameMap 
 **/
class ParanormalGameMap extends GameMap{


    constructor(canvas, context, WIDTH, HEIGHT){           
        super(canvas, context, WIDTH, HEIGHT);  
        this.initLogicalMap();
        this.populate();
        this.canReproduce = 0;
    }
    
    
    populate(){
        this.drawMap();
        for(var x=0; x<this.WIDTH; x++){
            for(var y=0; y<this.HEIGHT; y++){
                 if(x==y || x==(this.HEIGHT-y)){
                    this.map[x][y] = new ParanormalFormOfLife(x*GROSSISSEMENT, y*GROSSISSEMENT, this.context);
                    this.map[x][y].drawPLifeForm(this.map[x][y].getColor());
                 }
            }
        } 
    }
    
    lifeGoesOn(){
        for(var x =0; x<this.WIDTH;x++){
            for(var y =0; y<this.HEIGHT;y++){
                if(this.map[x][y]){
                    this.live(x,y);
                }
            }
        }
    }
    
    live(x,y){
        ////debug("live "+ x+";"+y)
        if(this.map[x][y] instanceof ParanormalFormOfLife) {
            var color= this.map[x][y].getColor();
            this.map[x][y].drawPLifeForm(color);
            
            if(this.map[x][y].getFacteur()%2==0 && alive<1000 ) { 
                this.reproduce(x,y, color);
                alive++;
            }if(this.getNeighbours(x,y)>3) { 
                this.kill(x,y);
                alive--;
            }
            else{
                if(alive<1000 ){
                    this.reproduce(x,y, "white"); 
                }
                if(alive>this.WIDTH*this.HEIGHT/2  ){
                    this.kill(x,y);
                    alive--;
                }
                
            }
        }
    }

      
reproduce(x,y, color){
    alive++;     
    if(x<this.WIDTH-1&&!this.map[x+1][y]){
    this.map[x+1][y] = new ParanormalFormOfLife((x+1)*GROSSISSEMENT, y*GROSSISSEMENT, this.context);
    this.map[x+1][y].drawPLifeForm(color);
    }else
    if(x>0 && !this.map[x-1][y]){
    this.map[x-1][y] = new ParanormalFormOfLife((x-1)*GROSSISSEMENT, y*GROSSISSEMENT, this.context);
    this.map[x-1][y].drawPLifeForm(color);
                 }else

    if(y<this.HEIGHT-1&&!this.map[x][y+1]){
    this.map[x][y+1] = new ParanormalFormOfLife(x*GROSSISSEMENT, (y+1)*GROSSISSEMENT, this.context);
    this.map[x][y+1].drawPLifeForm(color);

    }else  if(y>1&&!this.map[x][y-1]){
    this.map[x][y-1] = new ParanormalFormOfLife(x*GROSSISSEMENT, (y-1)*GROSSISSEMENT, this.context);
    this.map[x][y-1].drawPLifeForm(color);
    }
     
    }
}



