
function Energy(){

    this.pos = createVector(random(width*0.2, width*0.8), random(height*0.2, height*0.8))
    this.energy = random(0, 100)
    this.cor = color(0,255,0)
    this.raio = this.energy*0.08
    //this.array = pointsArray


    // Faz aparecer
    this.show = function(){
       
        stroke(255)
        fill(this.cor)
        ellipse(this.pos.x, this.pos.y, this.raio, this.raio)
        //this.array.push(this)
        //console.log(this)
                
    }

    this.apaga = function(energyPoints){

        energyPoints.splice(energyPoints.indexOf(this), 1)

    }


}