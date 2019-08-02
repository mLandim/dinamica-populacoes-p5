
function Cell(tipo, p, r, c){

    this.tipo = tipo
    this.id = char(random(100)) + random(1000)
    this.estaVivo = false
    this.frameInicial = 0
    this.frameFinal = 0
    this.duracao = 0
    this.expectativaVida = random(100, 300)
    this.vel = createVector()
    this.acc = createVector()
    this.alvo = null
    this.alpha = 100
    this.raio = r || 40
    this.cor = c || color(random(150,255), random(150,255), random(150,255), this.alpha)
    
    this.raioAcao = this.raio / (this.raio*0.5)
    this.maxVel = 5/this.raio

    // Propriedades da célula
    if(p){
        this.pos = p.copy()
    }else{
        this.pos = createVector(random(0, width), random(0, height))
    }
   

   




    // Avalia se foi clidado
    this.clicado = function(x, y){

        let d = dist(this.pos.x, this.pos.y, x, y)
        if(d < 100){
            return true
        }else{
            return false
        }

    }

    // Faz aparecer
    this.show = function(){

        noStroke()
        fill(this.cor)
        ellipse(this.pos.x, this.pos.y, this.raio, this.raio)
    
    }
    
    // Controla Ciclo de vida
    this.viver = function(frameAtual, cells){

        if(!this.estaVivo){

            if(this.frameInicial===0){
                this.frameInicial = frameAtual
                this.estaVivo = true
                //console.log(this.id + ' Nasceu')
            }
            
        
        }else{

            this.duracao = frameAtual - this.frameInicial

            if(this.duracao <= this.expectativaVida){
                // Continua vivendo
                this.alpha += 1
                // Cresce
                this.cresce(0.1)
                // Se move (eleatoriamente por enquanto)
                this.move(cells)
                this.come(cells)
                // Realiza Mitose (se divide)
                this.mitose(cells)
                


            }else{
               
                let chance = random(0, 10)
                // Morre
                if(chance < 8 ){
                    this.morre(cells, frameAtual)
                }
                
            }
           

        }
        

    }

    this.cresce = function(multplicador){
        this.raio = this.raio + multplicador
    }
    
    // Movimento aleatóreo na tela
    this.move = function(){

        
            // Respeitando bordas do frame
            let novoX
            let novoY
            let peso = 0.1*this.raio
            /*
            if(this.pos.x >= width){
                novoX = this.pos.x - 20
            }else if(this.pos.x < 0){
                novoX = this.pos.x + 20
            }else{
                novoX = this.pos.x + random(-width*peso , width*peso)
            }
            if(this.pos.y >= height){
                novoY = this.pos.y - 20
            }else if(this.pos.y < 0){
                novoY = this.pos.y + 20
            }else{
                novoY = this.pos.y + random(-height*peso , height*peso)
            }
            */
            if(this.pos.x >= width){
                novoX =  -(this.raio*1.1)
            }else if(this.pos.x < 0){
                novoX =  (this.raio*1.1)
            }else{
                novoX = random(-peso , peso)
            }
            if(this.pos.y >= height){
                novoY =  -(this.raio*1.1)
            }else if(this.pos.y < 0){
                novoY =   (this.raio*1.1)
            }else{
                novoY =  random(-peso , peso)
            }

            //this.vel = createVector(novoX, novoY)

            //let vel = createVector(novoX, novoY)
            let cacando = this.cacar(cells)
            // verifica se está caçando
            if(cacando === 0) { // Não está
                this.vel = createVector(novoX, novoY)
            }else{ // está caçando
                this.acc.add(cacando)
                this.vel.add(this.acc)
                
            }

            this.pos.add(this.vel) // Atualiza POsição
            this.acc.mult(0) // zerando aceleracao


            // Mata quem saiu do canvas
            if(this.pos.x > width || this.pos.y > height || this.pos.x < 0 || this.pos.y < 0){
                this.morre(cells)
            }
     
    }

    this.cacar = function(cells){

        let raioAcao = this.raio*5
        let self = this
        this.alvo = null

        for (let index = 0; index < cells.length; index++) {
            const alvo = cells[index];
            let distancia = dist(self.pos.x, self.pos.y, alvo.pos.x, alvo.pos.y)
            if(distancia < raioAcao && self.tipo != alvo.tipo){
                self.alvo = alvo
                break 
            }
        }

        /*
        cells.forEach(alvo => {
            let distancia = dist(self.pos.x, self.pos.y, alvo.pos.x, alvo.pos.y)
            if(distancia < raioAcao && self.tipo != alvo.tipo){
                self.alvo = alvo 
            }
        })*/
        
        let persegue

        if(self.alvo===null){
            persegue = 0
        }else{

            // Caça
            if(self.raio >= self.alvo.raio*2){
                let fome = p5.Vector.sub(this.alvo.pos, self.pos)
                fome.setMag(5)
                persegue = p5.Vector.sub(fome, self.vel)
                persegue.limit(0.3)

            }else if (self.raio <= self.alvo.raio){  // foge
                let fome = p5.Vector.sub(this.alvo.pos, self.pos)
                fome.mult(-1)
                fome.setMag(5)
                persegue = p5.Vector.sub(fome, self.vel)
                persegue.limit(0.3)

            }else{

                persegue = 0
            }
           
        }
       
        return persegue

    }

    this.come = function(cells){
        var self = this
        cells.forEach(alvo => {
            
            let distancia = dist(self.pos.x, self.pos.y, alvo.pos.x, alvo.pos.y)
            if(distancia < self.raio  && alvo.raio < self.raio*0.5){
                if(alvo.tipo != self.tipo){
                    alvo.morre(cells)
                    self.expectativaVida = self.expectativaVida + 40
                    self.cresce(0.3)
                }else{
                    alvo.morre(cells)
                    self.expectativaVida = self.expectativaVida + 20
                    self.cresce(0.1)
                }
             
            }

        })

    }

    this.mitose = function(cells){

        if(this.estaVivo){

            if(this.duracao > Math.floor(this.expectativaVida*0.5)  && this.duracao < Math.floor(this.expectativaVida*0.8) && random(1,10) > 9 ){
                
                var cell = new Cell(this.tipo, this.pos.mult(1.01), random(this.raio*0.4, this.raio*0.5), this.cor)
                cells.push(cell)
                this.raio = this.raio - this.raio*0.2
            }
         
        }

        
    }


    this.morre = function(cells, frame){

        this.estaVivo = false
        this.frameFinal = frame
        cells.splice(cells.indexOf(this), 1)
        
        //console.log(this.id + ' Morreu')
        //console.log(this)

    }
}

