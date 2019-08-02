
function Cell(tipo, p, r, c, e){

    // Propriedades da célula
    this.tipo = tipo
    this.id = char(random(100)) + random(1000)
    this.estaVivo = false
    this.frameInicial = 0
    this.frameFinal = 0
    this.duracao = 0
    this.energinaBasal = random(0.01, 0.05)
    this.energia = e || 255
    this.expectativaInicialVida = random(100, 1000)
    this.expectativaVida = 0
       
    this.cor = c || color(random(150,255), random(150,255), random(150,255), this.energia)
    
    this.raio = r || 40
    this.raioAcao = this.raio / (this.raio*0.5)
    this.maxVel = 50/this.raio
    this.multplicador = this.raio*0.02
    
    this.acc = createVector()
    this.vel = createVector()
    if(p){
        this.pos = p.copy()
    }else{
        this.pos = createVector(random(width*0.2, width*0.8), random(height*0.2, height*0.8))
    }
    
    this.alvo = null
    this.predador = null

   
    // Avalia se foi clidado
    this.clicado = function(x, y){
        
        let d = dist(this.pos.x, this.pos.y, x, y)
        if(d < this.raio*2){
            //return true
            console.log(this.tipo+ ' >> '+this.id+ ' >> '+this.energia)
        }else{
            //return false
        }
        
        //console.log(this.id+ ' >> '+this.energia)


    }

    // Faz aparecer
    this.show = function(){

        noStroke()
        fill(this.cor)
        ellipse(this.pos.x, this.pos.y, this.raio, this.raio)
        
    }

   
    
    // Controla Ciclo de vida
    this.viver = function(frameAtual, cells, energyPoints, poisonPoints){

        if(!this.estaVivo){

            if(this.frameInicial===0){
                this.frameInicial = frameAtual
                this.estaVivo = true
                //console.log(this.id + ' Nasceu')
            }
            
        
        }else{

            this.atualizaExpectativa()
            this.duracao = frameAtual - this.frameInicial
              
            if(this.energia > 0){ // Se ainda tem energia :: pode viver
                
                // Continua vivendo
                //console.log(this.id+ ' >> '+this.energia)
                // Cresce
                this.cresce(this.energinaBasal)
                // Se move (eleatoriamente por enquanto)
                this.move(cells)
                this.come(cells)

                // Busca específica po energyPoints
                if(energyPoints.length > 0 ){
                    this.findEnergy(energyPoints)
                }
                if(poisonPoints.length > 0 ){
                    this.avoidPoison(poisonPoints)
                }

                // Realiza Mitose (se divide)
                this.mitose(cells)
                
                // Se passou da expectativa de vida :: pode morrer mesmo com energia
                if(this.duracao > this.expectativaVida){
                    let chance = random(0, 10)
                    // Morre
                    if(chance > 8 ){
                        this.morre(cells, frameAtual)
                    }
                }


            }else{ // Se aenergia acabou :: morre
             
                this.morre(cells, frameAtual)
                
            }
           

        }
        

    }

    // Atualiza a expectativa de vida
    this.atualizaExpectativa = function(){
        this.expectativaVida = this.expectativaInicialVida + this.energia 
    }
    // Atualiza o nível de energia
    this.atualizaEnergia = function(value){

        this.energia += value
        this.cor.setAlpha(this.energia)
        //this.multplicador = this.raio*0.02

        this.atualizaExpectativa()
    }

    // Muda o raio do espécime
    this.cresce = function(fator){
        this.raio = this.raio + fator
        this.atualizaEnergia(fator*(-1))
    }

    // Cordena movimento (caçar, fugir ou aleatóreo)
    this.move = function(){

        
            // Respeitando bordas do frame
            let novoX
            let novoY
            let peso = 0.05*this.raio
            let ajustaVelN = (1/this.raio)*(-1) 
            let ajustaVelP = (1/this.raio)
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
            if(this.pos.x >= width*0.9){
                novoX = ajustaVelN
            }else if(this.pos.x < 0.1*width){
                novoX = ajustaVelP
            }else{
                novoX = random(-peso , peso)
            }

            if(this.pos.y >= height*0.9){
                novoY =  ajustaVelN
            }else if(this.pos.y <  0.1*height){
                novoY =  ajustaVelP
            }else{
                novoY =  random(-peso , peso)
            }

            // Verifica se precisa fugir ou se pode caçar
            let fugindo = this.fugir(cells)
            
            
            
            // Fugir tem prioridade
            if(fugindo === 0) {   
                
                let cacando = this.cacar(cells)
                // verifica se está caçando
                if(cacando === 0) { // Não está
                    this.vel = createVector(novoX, novoY) // Movimento aleatório
                }else{ // está caçando
                    this.acc.add(cacando)
                    this.vel.add(this.acc)
                    
                }

            }else{

                this.acc.add(fugindo)
                this.vel.add(this.acc)

            }

            this.pos.add(this.vel) // Atualiza Posição
            this.atualizaEnergia(this.vel.mag()*(-0.1))
            this.acc.mult(0) // zerando aceleracao


            // Mata quem saiu do canvas
            if(this.pos.x > width || this.pos.y > height || this.pos.x < 0 || this.pos.y < 0){
                this.morre(cells)
            }
     
    }
    this.fugir = function(cells) {
        
        let raioAcao = this.raio*4
        let self = this
        this.predador = null
        for (let index = 0; index < cells.length; index++) {

            const predador = cells[index];
            let distancia = dist(self.pos.x, self.pos.y, predador.pos.x, predador.pos.y)
            // Se estiver no raio de ação e for menor que o predador (independente do tipo)
            if(distancia < raioAcao && self.raio < predador.raio){ 
                self.predador = predador
                break 
            }
        }

        let foge
        if(self.predador===null){
            foge = 0
        }else{

            let medo = p5.Vector.sub(this.predador.pos, self.pos)
            medo.mult(-1)
            medo.setMag(this.maxVel)
            foge = p5.Vector.sub(medo, self.vel)
            foge.limit(0.3)

        }


        return foge

    }
    this.cacar = function(cells){

        let raioAcao = this.raio*6
        let self = this
        //this.alvo = null
        
        // Só procura alvo se não tiver alvo atual ou ou alvo atual estiver morto
        //if(cells.indexOf(this.alvo) === -1 && this.alvo===null ){

        
            for (let index = 0; index < cells.length; index++) {
                const alvo = cells[index];
                let distancia = dist(self.pos.x, self.pos.y, alvo.pos.x, alvo.pos.y)
                // Se estiver dentro do raio de ação e for de tipo diferente
                if(distancia < raioAcao && self.tipo != alvo.tipo && self.raio >= alvo.raio*2){
                    self.alvo = alvo
                    break 
                }
            }

        //}
        
        let persegue

        if(self.alvo===null){
            persegue = 0
        }else{

            let fome = p5.Vector.sub(this.alvo.pos, self.pos)
            fome.setMag(this.maxVel)
            persegue = p5.Vector.sub(fome, self.vel)
            persegue.limit(0.8)

        }
       
        return persegue

    }

    // gera ganho de energia e parte da massa (de quem foi consumido)
    this.come = function(cells){
        var self = this
        cells.forEach(alvo => {
            
            let distancia = dist(self.pos.x, self.pos.y, alvo.pos.x, alvo.pos.y)
            
            if(distancia < self.raio*0.5  && alvo.raio <= self.raio*0.5){
                
                if(alvo.tipo != self.tipo){

                    self.atualizaEnergia(alvo.energia)
                    alvo.morre(cells)
                    self.cresce(alvo.raio*0.1)
                    
                }else{
                 
                    self.atualizaEnergia(alvo.energia*0.5)
                    alvo.morre(cells)
                    self.cresce(alvo.raio*0.03)

                }
             
            }



        })

    }

    this.findEnergy = function(energyPoints){
        let self = this
        for (var index = 0; index < energyPoints.length; index++) {
            let element = energyPoints[index];

            let distancia = dist(self.pos.x, self.pos.y, element.pos.x, element.pos.y)
            
            if(distancia < self.raio*5){
                
                let persegue
                let fome = p5.Vector.sub(element.pos, self.pos)
                fome.setMag(this.maxVel)
                persegue = p5.Vector.sub(fome, self.vel)
                persegue.limit(0.8)
                this.acc.add(persegue)
                this.vel.add(this.acc)
                this.pos.add(this.vel) // Atualiza Posição
                this.atualizaEnergia(this.vel.mag()*(-0.1))
                this.acc.mult(0)

                if(distancia < self.raio) {
                    self.atualizaEnergia(element.energy)
                    // console.log(element.energy)
                    element.apaga(energyPoints)
                    break
                }
               
            }

        }

    }
    this.avoidPoison = function(poisonPoints){
        let self = this
        for (var index = 0; index < poisonPoints.length; index++) {
            let element = poisonPoints[index];

            let distancia = dist(self.pos.x, self.pos.y, element.pos.x, element.pos.y)
            
            if(distancia < self.raio*5){
                
                let foge
                let medo = p5.Vector.sub(element.pos, self.pos)
                medo.mult(-1)
                medo.setMag(this.maxVel)
                foge = p5.Vector.sub(medo, self.vel)
                foge.limit(0.8)
                this.acc.add(foge)
                this.vel.add(this.acc)
                this.pos.add(this.vel) // Atualiza Posição
                this.atualizaEnergia(this.vel.mag()*(-0.1))
                this.acc.mult(0)

                if(distancia < self.raio) {
                    self.atualizaEnergia(element.energy*(-1))
                    // console.log(element.energy)
                    element.apaga(poisonPoints)
                    break
                }
               
            }

        }

    }

    // mitose gera perda de massa e energia
    this.mitose = function(cells){
        
        if(this.estaVivo){

            const raioTransferido = random(this.raio*0.4, this.raio*0.5)
            const energiaTranferida = random(this.energia*0.4, this.energia*0.5) // Ajuste de custo energético da mitose
           

            if(this.duracao > Math.floor(this.expectativaVida*0.4)  && random(1, 10) > 5 && this.raio > 10 ){
                
                let cell = new Cell(this.tipo, this.pos, raioTransferido, this.cor, energiaTranferida)
                cells.push(cell)

                this.raio = this.raio - raioTransferido/4

                this.atualizaEnergia((energiaTranferida/3)*(-1))

            }
         
        }
        
    }

    // Mata espécime
    this.morre = function(cells, frame){

        this.estaVivo = false
        this.frameFinal = frame
        cells.splice(cells.indexOf(this), 1)
        
        //console.log(this.id + ' Morreu')
        //console.log(this)

    }
}

