//Arrays that hold point coordinates
let xVals;
let yVals;
let zVals;

let curveQueue; //holds each curve object
let hueVal; //color of each curve
let curve;

//Sliders and corresponding slider variables
let refreshRate;
let refreshRateSlider;
let circleSize;
let circleSizeSlider;
let fadeRate;
let fadeRateSlider;
let vis;
sys = new aisSys();

$('#System').change(function(){
  systype = this.value;
  console.log(systype);
  if (systype=='lorSys'){
    sys = new lorSys();
  }else if(systype=='aisSys'){
    sys = new aisSys();
  }else if(systype=='burkeSys'){
    sys = new burkeSys();
  }else if(systype=='rosslerSys'){
    sys = new rosslerSys();
  }else if(systype=='arnSys'){
    sys = new arnSys();
  }
  setup();
});

function setup() {
  vis = createCanvas(2*window.innerWidth/3,window.innerHeight, WEBGL); //Create 3D canvas
  vis.position(window.innerWidth/6,0)
  scale(5);
  colorMode(HSB, 200); //Visibile spectrum (0=Red, 200=Violet)
  noStroke(); //No outlines on shapes
  
  //Create and Position Sliders
  refreshRateSlider = createSlider(0, 30, 10);
  refreshRateSlider.position(0, 200);
  circleSizeSlider = createSlider(.7, 20, 2);
  circleSizeSlider.position(0, 230);
  fadeRateSlider = createSlider(0, 100, 1);
  fadeRateSlider.position(0, 260);
  
  //Populate Queue with Chaos Curves
  curveQueue = new SimpleQueue(500);
  
  //INSERT CHAOS FUNCTION CALL BELOW
  systemSetUp(sys,[0,.1,0],100,.001);

}

//Called every frame
function draw() {

  //Record slider values
  refreshRate = refreshRateSlider.value();
  circleSize = circleSizeSlider.value();
  fadeRate = fadeRateSlider.value();
  
  background(400); //Set white background

  orbitControl(); //Allow user to navigate 3D space

  //Method draws curves to canvas
  curveQueue.displayContents(frameCount%refreshRate);
  curve.display();

}

/* Generates system iterative values.
 * Generates orbit on X0 iterating by dt until t=tfin(via ChaosFunctions.js).
 * Keeps 100 evenly distributed values from orbit
 * Creates curve objects and populates curve array.
 */
function systemSetUp(sys,X0,tfin,dt){
  let chaosVal = sys.getChaosVar();
  for (let i=chaosVal-.02; i<chaosVal+.04; i+=0.005){
    hueVal = ((i-chaosVal+.02))*1600;
    sys.alterVarsByIndex(sys.getNumVars()-1,i);
    orb = sys.generateScaledOrbit(X0,tfin,dt);
    if(Math.abs(i-chaosVal)<.006){
      curve = new CurveWatch(orb[0],orb[1],orb[2],0);
    }
    let keepRepeat = Math.trunc(orb[0].length/200);
    xVals = []; yVals = []; zVals =[];
    for (let i=0;i<orb[0].length;i+=keepRepeat){
      xVals.push(orb[0][i]);
      yVals.push(orb[1][i]);
      zVals.push(orb[2][i]);
    }
    curveQueue.enqueue(new Curve(xVals,yVals,zVals,hueVal));
  }
  
}

/* Curve Object: colored, fading, regenerating spheres
 * Input: xRange,yRange,zRange - plot coordinates
 *        hueNum - HSB color of spheres
 * lifespan: decrements opacity from 200 until refreshed.
 * refresh(): reset lifespan
 * display(): draw spheres to canvas, decrement lifespan.
 */
class CurveWatch {
  
  constructor(xCoords,yCoords,zCoords, hueNum){
    this.xSet = xCoords;
    this.ySet = yCoords;
    this.zSet = zCoords;
    this.hue = hueNum;
    this.lifespan = this.xSet.length/700;
  }
  refresh(){
    this.lifespan = xSet.length/700;
  }
  display(){
    for (let i=frameCount*10; i<10*frameCount+this.lifespan; i++){
      push();
      fill(this.hue*2, 100, 200, (i-frameCount*10)*10);
      translate(this.xSet[i], this.ySet[i], this.zSet[i]);
      sphere(circleSize);
      pop();
    }
  } 
}

class Curve {
  
    constructor(xCoords,yCoords,zCoords, hueNum){
      this.xSet = xCoords;
      this.ySet = yCoords;
      this.zSet = zCoords;
      this.hue = hueNum;
      this.lifespan = 200;
    }
    refresh(){
      this.lifespan = 200;
    }
    display(){
      for (let i=0; i<this.xSet.length; i++){
        push();
        fill(this.hue, 200, 200, this.lifespan/2);
        translate(this.xSet[i], this.ySet[i], this.zSet[i]);
        sphere(circleSize);
        pop();
      }
      this.lifespan-=fadeRate;
    } 
  }

/* SimpleQueue: partially implemented queue with fixed size
 * enqueue(): add element and dequeue overflow values FIFO.
 * displayQueue(refreshIndex): Refresh oldest curves, display all curves.
 */
class SimpleQueue {
  constructor(length){
    this.length = length;
    this.contents = [];
  }
  
  enqueue(item){
    this.contents.push(item);
    if (this.contents.length > this.length){
      this.contents.shift();
    }
  }
  
  displayContents(refreshIndex) {
    for (let i=refreshIndex; i<this.contents.length; i+=refreshRate){
      this.contents[i].refresh();
    }
    for (let i=0; i<this.contents.length; i++){
      this.contents[i].display();
    }
  }
}