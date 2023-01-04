let sun
let WIDTH
let HEIGHT
let backGroundColor
let loopCount = 0
let DEBUG = true

function setup() {
  
  WIDTH = windowWidth
  HEIGHT = windowHeight
  createCanvas(WIDTH, HEIGHT);
  
  let sPosition = createVector(random(0.2,0.8)*WIDTH>>0,random(0,0.4)*HEIGHT>>0)
  let sDiameter = WIDTH/8*random(0.8,3)
  let sNumRays = random(15,30)>>0
  let sAmplitude = random(3,9)
  let sPhase = random(5,20)
  let sFrequency = random(5,20)
  let sRayLength = random(WIDTH/5, WIDTH/2)>>0
  let sRayStrokeWeight = random(5,15)>>0
  let sFillColor = color(200, random(30)>>0, random(60)>>0)
  let sStrokeColor = color(255, random(60)>>0, random(100)>>0)
  
  
  sun = new Sun(sPosition, sDiameter, sNumRays, sAmplitude, sPhase, sFrequency, sRayLength,sRayStrokeWeight, sFillColor, sStrokeColor)
  
  backGroundColor = color(random(100),random(50), 210)
  
}

function draw() {
  background(backGroundColor);
  sun.draw()
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
    this.strokeColor =strokeColor
  }
  
  draw(){
    
    
    push()
    translate(this.position.x, this.position.y)
    
    noStroke()
    fill(this.fillColor)
    circle(0,0, this.diameter)
    
    let theta = 2*PI/this.numRays
    let y
    let currentColor
    
    
    strokeWeight(this.rayStrokeWeight)
    for(let i = 0; i<this.numRays;i++){
      
      push()
      rotate(theta*i)
        for(let x =0; x<this.rayLength;x++){
          currentColor = lerpColor(this.strokeColor, color("#FFBF00"),x/this.rayLength)
          y = this.amplitude*sin(this.frequency * x + this.phase+loopCount/5)>>0
          stroke(currentColor)
          point(x,y)   
        } 
      pop()
      
    }
    
    DEBUG&&fill(0)
    DEBUG&&text("Position: " + this.position.x + " " + this.position.y, 20, 0)
    DEBUG&&text("Sun Rays/Amp/Freq/RayLength: " + this.numRays + "/" + Math.round(this.amplitude).toString() + "/" + Math.round(this.frequency).toString() +"/" + Math.round(this.rayLength).toString(), 20, 17)
    DEBUG&&text("Sun Colors: " + red(this.fillColor) + "/" +  green(this.fillColor) + "/" +  blue(this.fillColor), 20, 34)
    pop()
    
    loopCount++
  }
}