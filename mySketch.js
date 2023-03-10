let paletteB = ["#59656F", "#694A38", "#92BFB1", "#6D1A36", "#02040f"]
let carPalette = ["Indigo", "DarkSlateBlue", "MediumSlateBlue", "Teal"]  
let crossPalette = ["#7C2529", "#D6A58B", "#9C7269", "#000000", "#FFFFFF"]



let sun
let buildings 
let road 
let WIDTH
let HEIGHT
let backGroundColor
let loopCount = 0
let DEBUG = false
let maxLoop = 40
let foreground
let DEBUG2  = false


function setup() {
  
  WIDTH = windowWidth
  HEIGHT = windowHeight
  createCanvas(WIDTH, HEIGHT);
  foreground = createGraphics(WIDTH,HEIGHT)

  //set up sun
  let sPosition = createVector(random(0.2,0.8)*WIDTH>>0,random(0,0.25)*HEIGHT>>0)
  let sDiameter = WIDTH/8*random(0.8,3)
  let sNumRays = random(15,30)>>0
  let sAmplitude = random(3,9)
  let sPhase = random(5,20)
  let sFrequency = random(5,20)
  let sRayLength = random(WIDTH, WIDTH*2)>>0
  let sRayStrokeWeight = random(5,15)>>0
  let sFillColor = color(200, random(30)>>0, random(170)>>0)
  let sStrokeColor = color(255, random(60)>>0, random(100)>>0)
  
  //create sun object
  sun = new Sun(sPosition, sDiameter, sNumRays, sAmplitude, sPhase, sFrequency, sRayLength,sRayStrokeWeight, sFillColor, sStrokeColor)
  

  //set up buildings
  let bNumBuildings = random(10,15)>>0
  let bMaxHeight = random(HEIGHT/4, HEIGHT/2.7)>>0
  let bMaxWidth = random(bMaxHeight/5, bMaxHeight/4)>>0
  let bBuildingPalette = paletteB
  let bBase = random(0.67, 0.85)*HEIGHT 

  //create building, no drawing yet
  buildings = new Buildings(bNumBuildings, bMaxHeight, bMaxWidth, bBuildingPalette, bBase)
  
  //set up road
  let rHeight =(HEIGHT-bBase)*random(0.7,0.9)>>0
  let rColor1 = "darkgray"
  let rColor2 = "yellow"
  let rBase = bBase
  let rCars = 5

  //create road, no drawing
  road = new Road(rHeight, rColor1, rColor2, rBase, rCars)
  

  //set background color, and clear screen
  backGroundColor = color(random(100),random(50), 210)
  background(backGroundColor)
  if (DEBUG){
    foreground.push();
    foreground.stroke(255)
    foreground.strokeWeight(1)
    foreground.noFill()
    foreground.rect(0,rBase,WIDTH,HEIGHT)
    foreground.pop();
  }else{
    //plants in non-debug mode
    foreground.fill("darkgreen")
    foreground.rect(0,rBase,WIDTH,HEIGHT)
  }
}

function draw() {
  //clear screen
  fill(backGroundColor)
  noStroke()
  background(backGroundColor)

  //draw all elements on foreground graphic.  Building and road animate less frequently than sun.
  sun.draw()
  buildings.draw(10,foreground)
  road.draw(4, foreground)

  //update the foreground elements on the image
  image(foreground,0,0)
  loopCount++
  if (loopCount>=maxLoop) {
    noLoop()
   debugText("Buildings (maxHeight/maxWidth/Base):" + buildings.maxHeight + "/" + buildings.maxWidth + "/" + buildings.base,WIDTH/4>>0,buildings.base+12, foreground)
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

    draw(mySkip, targetGraphic){
      if (loopCount%mySkip==0){
        let currentColor
        let currentX
        for(let i = 0 ; i<this.numBuildings;i++){
          currentColor = random(this.buildingPalette)
          if (DEBUG){
            targetGraphic.push();
            targetGraphic.stroke("#ffffff90")
            targetGraphic.strokeWeight(1)
            targetGraphic.noFill()
            // draw shape
            currentX= random(WIDTH)>>0
            let posY = this.base>>0;
            let wid = random(this.maxWidth/4, this.maxWidth)>>0;
            let height = -1*random(this.maxHeight/4, this.maxHeight)>>0;
            let detailX = this.maxWidth/20>>0;
            targetGraphic.rect(currentX, this.base>>0, wid, height, detailX)
            debugText(i + ": " + currentX + "," + posY, currentX, posY+height, foreground)
            /* DEBUG&&circle(currentX, this.base-this.maxHeight*random(.65,.7)>>0,10) */
            targetGraphic.pop();
          }else{
            
            // draw shape
            targetGraphic.fill(currentColor)
            currentX= random(WIDTH)>>0
            let wid =  random(this.maxWidth/4, this.maxWidth)>>0
            let height = -1*random(this.maxHeight/4, this.maxHeight)>>0;
            let slope1 = random()
            let slope2 = random()
            let crossColor = random(crossPalette)
            targetGraphic.rect(currentX, this.base>>0,wid, height, this.maxWidth/20>>0)


            //this is where the hashes get drawn, diagonally
            targetGraphic.push()
            targetGraphic.translate(currentX, this.base>>0)
            
            let x = 0
            let y = 0
            let lines = random(7,9)>>0
            let c = Math.abs(height/lines)
            targetGraphic.stroke(color(crossColor))
            targetGraphic.strokeWeight(1)

            //hashes going one direction
            DEBUG2&&console.log("Drawing lines1. Slope, C" + slope1 + "/" + c)
            let currentLines = -lines*.5>>0
            while(currentLines<lines*1.5){
              if (currentLines<lines&&currentLines>0) {
                while(x<=wid&&y>=height&&y<=0){
                  y=x*slope1-c*currentLines>>0
                  targetGraphic.point(x,y)
                  if (DEBUG2&&currentLines==0) console.log("Point: " + x + "/" + y)
                  x++
                }
              } else {
                //hashes starting out of building's height range need different rule
                while(x<=wid){
                  y=x*slope1-c*currentLines>>0
                  if(y>=height&&y<=0) targetGraphic.point(x,y)
                  if (DEBUG2&&currentLines==0) console.log("Point: " + x + "/" + y)
                  x++
                }
              }
             
              currentLines++
              x =0
              y = 0
            }
            
            //hashes going a second slope direction
            DEBUG2&&console.log("Drawing lines2. Slope, C" + slope2 + "/" + c)
            currentLines = -lines*.5>>0
            x = 0
            y = 0
            while(currentLines<lines*1.5){
              if (currentLines<lines&&currentLines>0) {
                while(x<=wid&&y>=height&&y<=0){
                  y=-x*slope2-c*currentLines>>0
                  targetGraphic.point(x,y)
                  if (DEBUG2&&currentLines==0) console.log("Point: " + x + "/" + y)
                  x++
                }
              } else {
                 //hashes starting out of building's height range need different rule
                while(x<=wid){
                  y=-x*slope2-c*currentLines>>0
                  if(y>=height&&y<=0) targetGraphic.point(x,y)
                  if (DEBUG2&&currentLines==0) console.log("Point: " + x + "/" + y)
                  x++
                }
              }
             
              currentLines++
              x =0
              y = 0
            }
            targetGraphic.pop()

            //draw tiny circles
            targetGraphic.fill("white")
            targetGraphic.circle(currentX+wid/2>>0, this.base-this.maxHeight*random(1.05,1.15)>>0,10)
          }
          
        }
      }
     
    }
}

class Road{
    constructor(height, color1, color2, base, cars){
       this.height = height
       this.base = base 
       this.color1 = color1 
       this.color2 = color2 
       this.cars= cars
    }
    draw(mySkip, targetGraphic){
      if (loopCount%mySkip==0) {
      if (DEBUG){
       
        targetGraphic.stroke(255)
        targetGraphic.strokeWeight(1)
        targetGraphic.noFill()
        // draw road
        targetGraphic.rect(0, this.base>>0, WIDTH, this.height)
        targetGraphic.rect(0, this.base+this.height*0.45>>0, WIDTH, this.height/10>>0)
        targetGraphic.rect(0, this.base+this.height*0.55>>0, WIDTH, this.height/10>>0)
        

        //draw cars
        if (loopCount>maxLoop/5) { //delay the car drawings
          let car1X
          let car2X
          // one car on each side of the road. 
          //these cars could also be replaced with car objects of similar rectangular 
          //dimensions which we can track through an animation instead of random.  

          for(let i=0; i<this.cars/2;i++){
            car1X = random(WIDTH)>>0
            targetGraphic.rect(car1X, this.base+this.height/8,this.height/4,this.height/6)
            debugText(car1X, car1X, this.base+this.height*2/8, foreground)

            car2X = random(WIDTH)>>0
            targetGraphic.rect(car2X, this.base+this.height*5.5/8,this.height/4,this.height/6)
            debugText(car2X, car2X, this.base+this.height*6.25/8, foreground)
          }
        }

      }else{
        // draw road 
        targetGraphic.fill(this.color1)
        targetGraphic.rect(0, this.base>>0, WIDTH, this.height)
        targetGraphic.fill(this.color2)
        targetGraphic.rect(0, this.base+this.height*0.45>>0, WIDTH, this.height/10>>0)
        targetGraphic.rect(0, this.base+this.height*0.55>>0, WIDTH, this.height/10>>0)


        //draw grass effect
        if (loopCount>maxLoop*.85){
          let grassX
          let grassY
          for(let i = 0; i<200;i++){
            grassX = random(0,WIDTH)>>0
            grassY = random(this.base+this.height, HEIGHT)
            targetGraphic.fill("yellowgreen")
            targetGraphic.rect(grassX, grassY, WIDTH/200>>0, HEIGHT/200>>0)
          }
        }

        //draw cars
        if (loopCount>maxLoop/5) { //delay the car drawings
          let car1X
          let car2X
          for(let i=0; i<this.cars/2;i++){
            car1X = random(WIDTH)>>0
            targetGraphic.fill(random(carPalette))
            targetGraphic.rect(car1X, this.base+this.height/8,this.height/4,this.height/6)
            debugText(car1X, car1X, this.base+this.height*2/8, foreground)
            car2X = random(WIDTH)>>0
            targetGraphic.fill(random(carPalette))
            targetGraphic.rect(car2X, this.base+this.height*5.5/8,this.height/4,this.height/6)
            debugText(car2X, car2X, this.base+this.height*6.25/8, foreground)
          }
        }
      }
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
    
    
    debugText("Position: " + this.position.x + " " + this.position.y, 20, 10,foreground)
    debugText("Sun Rays/Amp/Freq/RayLength: " + this.numRays + "/" + Math.round(this.amplitude).toString() + "/" + Math.round(this.frequency).toString() +"/" + Math.round(this.rayLength).toString(), 20, 27, foreground)
    debugText("Sun Colors: " + red(this.fillColor) + "/" +  green(this.fillColor) + "/" +  blue(this.fillColor), 20, 44,foreground)
    pop()
    

  }
}

function debugText( text, x, y, targetGraphic){
  if( !DEBUG ) return
  targetGraphic.push();
  targetGraphic.stroke("#00000050")
  targetGraphic.strokeWeight(4)
  targetGraphic.fill(255)
  targetGraphic.text(text, x, y)
  targetGraphic.pop();
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