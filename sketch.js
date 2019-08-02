
// Lista de células
let cells = []
let energyPoints = []


function setup() {

    createCanvas(900, 650)
    //background(0)
    for (var index = 0; index < random(200); index++) {
        energyPoints.push(new Energy())
    }
    

    
    cells.push(new Cell('A'))
    cells.push(new Cell('B'))
    cells.push(new Cell('C'))
    cells.push(new Cell('D'))
    cells.push(new Cell('E'))
    cells.push(new Cell('F'))
    

}

function draw() {

    background(0)

    for (var index = 0; index < energyPoints.length; index++) {
        let element = energyPoints[index];
        element.show()
    }

    
    //console.log(' >> '+cells.length)
    if(cells.length === 0){
        console.log(' >> '+cells.length)
        noLoop()
    }

    cells.forEach(cell => {
       
        cell.show()
        cell.viver(frameCount, cells, energyPoints)


    });

    console.log(' ## '+energyPoints.length)
   

}

function mousePressed(){

    cells.forEach(cell => {
        if(cell.clicado(mouseX, mouseY)){
            console.log('Acertou')
            cell.morre(cells)
            //cells.push(novaCell)
        }
    })

}












// fill e mouseIsPressed
function teste1(){
    
    if(mouseIsPressed){
        fill(geraRandomIntRgb(), geraRandomIntRgb(), geraRandomIntRgb())
        
        ellipse(mouseX, mouseY, 50, 50)
    }else{
        
    }
    
}

// pointLight()
function teste2() {
    background(0);
    let locX = mouseX - width / 2;
    let locY = mouseY - height / 2;
    translate(-100, 0, 0);
    lightFalloff(1, 0, 0);
    pointLight(250, 250, 250, locX, locY, 50);
    sphere(60);
   
}

// lightFalloff()
function teste3() {
    background(0);
    let locX = mouseX - width / 2;
    let locY = mouseY - height / 2;
    translate(-25, 0, 0);
    lightFalloff(1, 0, 0);
    pointLight(250, 250, 250, locX, locY, 50);
    sphere(20);
    translate(50, 0, 0);
    lightFalloff(0.9, 0.01, 0);
    pointLight(250, 250, 250, locX, locY, 50);
    sphere(20);
}

// directionalLight
function teste4() {
    
    background(0);
    
    rectMode(CENTER);

    //move your mouse to change light direction
    let dirX = (mouseX / width - 0.5) * 2;
    let dirY = (mouseY / height - 0.5) * 2;
    directionalLight(250, 0, 0, -dirX, -dirY, -1);
    
    noStroke();
    normalMaterial();
    sphere(40);
    
    
    translate(mouseX - (width/2), mouseY - (height/2));
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.03);
    rotateZ(frameCount * 0.05);

    torus(30, 15);
    torus(200, 1);

    translate(100, 100);
    ambientMaterial(255, 204, 100);
    box(10,30,50)
    translate(-200, 0);
    specularMaterial(255, 204, 0);
    box()
   
}