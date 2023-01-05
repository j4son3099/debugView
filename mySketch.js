let paletteB = ["#59656F", "#694A38", "#92BFB1", "#6D1A36", "#02040f"]
let sun
let buildings 
let road 
let WIDTH
let HEIGHT
let backGroundColor
let loopCount = 0
let DEBUG = true
let maxLoop = 40


function setup() {
  
  WIDTH = windowWidth
  HEIGHT = windowHeight
  createCanvas(WIDTH, HEIGHT);
  
  let sPosition = createVector(random(0.2,0.8)*WIDTH>>0,random(0,0.25)*HEIGHT>>0)
  let sDiameter = WIDTH/8*random(0.8,3)
  let sNumRays = random(15,30)>>0
  let sAmplitude = random(3,9)
  let sPhase = random(5,20)
  let sFrequency = random(5,20)
  let sRayLength = random(WIDTH/5, WIDTH/4)>>0
  let sRayStrokeWeight = random(5,15)>>0
  let sFillColor = color(200, random(30)>>0, random(170)>>0)
  let sStrokeColor = color(255, random(60)>>0, random(100)>>0)
  
  
  sun = new Sun(sPosition, sDiameter, sNumRays, sAmplitude, sPhase, sFrequency, sRayLength,sRayStrokeWeight, sFillColor, sStrokeColor)
  
  let bNumBuildings = random(10,15)>>0
  let bMaxHeight = random(HEIGHT/4, HEIGHT/2.7)>>0
  let bMaxWidth = random(bMaxHeight/5, bMaxHeight/4)>>0
  let bBuildingPalette = paletteB
  let bBase = random(0.67, 0.85)*WIDTH 

  buildings = new Buildings(bNumBuildings, bMaxHeight, bMaxWidth, bBuildingPalette, bBase)
  
  let rHeight =(HEIGHT-bBase)*random(0.7,0.9)>>0
  let rColor1 = "darkgray"
  let rColor2 = "yellow"
  let rBase = bBase

  road = new Road(rHeight, rColor1, rColor2, rBase)
  
  backGroundColor = color(random(100),random(50), 210)
  background(backGroundColor)
  if (DEBUG){
    push();
    stroke(255)
    strokeWeight(1)
    noFill()
    rect(0,rBase,WIDTH,HEIGHT)
    pop();
  }else{
    fill("darkgreen")
    rect(0,rBase,WIDTH,HEIGHT)
  }
}

function draw() {
  fill(backGroundColor)
  noStroke()
  rect(0,0, WIDTH, HEIGHT/2>>0)
  sun.draw()
  buildings.draw(10)
  //road.draw()

  loopCount++
  if (loopCount>=maxLoop) {
    noLoop()
   debugText("Buildings (maxHeight/maxWidth/Base):" + buildings.maxHeight + "/" + buildings.maxWidth + "/" + buildings.base,WIDTH/4>>0,buildings.base+12)
  }


}

class Buildings{
    constructor(numBuildings, maxHeight, maxWidth, buildingPalette, base){
      this.numBuildings = numBuildings
      this.maxHeight = maxHeight
      this.maxWidth = maxWidth
      this.buildingPalette = buildingPalette
      this.base = base

    }

    draw(mySkip){
      if (loopCount%mySkip==0){
        let currentColor
        let currentX
        for(let i = 0 ; i<this.numBuildings;i++){
          currentColor = random(this.buildingPalette)
          if (DEBUG){
            push();
            stroke("#ffffff90")
            strokeWeight(1)
            noFill()
            // draw shape
            currentX= random(WIDTH)>>0
            let posY = this.base>>0;
            let wid = random(this.maxWidth/4, this.maxWidth)>>0;
            let height = -1*random(this.maxHeight/4, this.maxHeight)>>0;
            let detailX = this.maxWidth/20>>0;
            rect(currentX, this.base>>0, wid, height, detailX)
            debugText(i + ": " + currentX + "," + posY, currentX, posY+height)
            /* DEBUG&&circle(currentX, this.base-this.maxHeight*random(.65,.7)>>0,10) */
            pop();
          }else{
            // draw shape
            fill(currentColor)
            currentX= random(WIDTH)>>0
            rect(currentX, this.base>>0, random(this.maxWidth/4, this.maxWidth)>>0, -1*random(this.maxHeight/4, this.maxHeight)>>0, this.maxWidth/20>>0)
            fill("white")
            DEBUG&&circle(currentX, this.base-this.maxHeight*random(.65,.7)>>0,10)
          }
          
        }
      }
     
    }
}

class Road{
    constructor(height, color1, color2, base){
       this.height = height
       this.base = base 
       this.color1 = color1 
       this.color2 = color2 
    }
    draw(){

      if (DEBUG){
        push();
        stroke(255)
        strokeWeight(1)
        noFill()
        // draw shape
        rect(0, this.base>>0, WIDTH, this.height)
        rect(0, this.base+this.height*0.45>>0, WIDTH, this.height/10>>0)
        rect(0, this.base+this.height*0.55>>0, WIDTH, this.height/10>>0)
        pop();
      }else{
        // draw shape
        fill(this.color1)
        rect(0, this.base>>0, WIDTH, this.height)
        fill(this.color2)
        rect(0, this.base+this.height*0.45>>0, WIDTH, this.height/10>>0)
        rect(0, this.base+this.height*0.55>>0, WIDTH, this.height/10>>0)
      }
      
    }

}

class Sun{
  constructor(position, diameter, numRays, amplitude, phase, frequency, rayLength, rayStrokeWeight, fillColor, strokeColor){
    this.position = position
    this.diameter = diameter
    this.numRays = numRays
    this.amplitude = amplitude
    this.phase = phase
    this.frequency = frequency
    this.rayLength = rayLength
    this.rayStrokeWeight = rayStrokeWeight
    this.fillColor = fillColor
    this.endColor = color("#FFBF00")
    this.strokeColor =strokeColor
    this.intermediateColors = []
    this.currentWave = []

    for(let x =0; x<this.rayLength;x++){
      this.intermediateColors[x] = lerpColor(this.strokeColor,this.endColor,x/this.rayLength)
    }
  }
  
  draw(){
    
    
    push()
    translate(this.position.x, this.position.y)
    
    if( DEBUG ){
      push();
      stroke(255)
      noFill()
      circle(0,0, this.diameter)
      pop();
    }else{
      noStroke()
      fill(this.fillColor)
      circle(0,0, this.diameter)
    }
    
    let theta = 2*PI/this.numRays
    let y
    
    tint(255,80)
    DEBUG ? strokeWeight(1) : strokeWeight(this.rayStrokeWeight)
    for(let i = 0; i<this.numRays;i++){
      
      push()
      rotate(theta*i)
        for(let x =0; x<this.rayLength;x++){
          stroke(this.intermediateColors[x])
          if (this.currentWave.length<=x) this.currentWave[x] = this.amplitude*sin(this.frequency * x + this.phase+loopCount/5)>>0
          y = this.currentWave[x]
          
          point(x,y)   
        } 
      
      pop()
      
    }
    this.currentWave = []
    
    
    debugText("Position: " + this.position.x + " " + this.position.y, 20, 0)
    debugText("Sun Rays/Amp/Freq/RayLength: " + this.numRays + "/" + Math.round(this.amplitude).toString() + "/" + Math.round(this.frequency).toString() +"/" + Math.round(this.rayLength).toString(), 20, 17)
    debugText("Sun Colors: " + red(this.fillColor) + "/" +  green(this.fillColor) + "/" +  blue(this.fillColor), 20, 34)
    pop()
    

  }
}

function debugText( text, x, y ){
  if( !DEBUG ) return
  push();
  stroke("#00000050")
  strokeWeight(4)
  fill(255)
  window.text(text, x, y)
  pop();
}


/*
  if (DEBUG){
    push();
    stroke(255)
    strokeWeight(1)
    noFill()
    // draw shape
    pop();
  }else{
    // draw shape
  }
*/