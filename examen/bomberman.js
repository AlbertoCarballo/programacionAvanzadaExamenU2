const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const columnas = 13;
const filas = 11;
const tamanioCelda = 80;
let bombaActiva = false;

canvas.width = columnas * tamanioCelda;
canvas.height = filas * tamanioCelda;

const mapa = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 0, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

const jugador = {
    x: 1,
    y: 1,
    size: 80,
    color: "blue",
    health: 3
};


let bombas = [];
let explosiones = [];
let pared = new Image();
let indestructible=new Image();
function pintarMapa() {
    for (let y = 0; y < filas; y++) {
        for (let x = 0; x < columnas; x++) {
            if (mapa[y][x] === 2) {
                indestructible.src="gorda.png";
                ctx.drawImage(indestructible, x * tamanioCelda,
                    y * tamanioCelda);
                    // ctx.fillStyle = "gray";
                    // ctx.fillRect(
                    //     x * tamanioCelda,
                    //     y * tamanioCelda,
                    //     tamanioCelda,
                    //     tamanioCelda
                    // );
                } else if (mapa[y][x] === 1) {
                    pared.src = "mecoboy.png";
                    ctx.drawImage(pared, x * tamanioCelda, y * tamanioCelda);
                    // ctx.fillStyle = "brown";
                    // ctx.fillRect(
                    //     x * tamanioCelda,
                    //     y * tamanioCelda,
                    //     tamanioCelda,
                    //     tamanioCelda
                    // );
                } else {
                    ctx.fillStyle = "white";
                    ctx.fillRect(
                        x * tamanioCelda,
                        y * tamanioCelda,
                        tamanioCelda,
                        tamanioCelda
                    );
                }
            }
        }
    }
    let prota = new Image();
    prota.src = "buho.png";
    function dibujarJugador() {
        ctx.drawImage(prota, jugador.x * tamanioCelda, jugador.y * tamanioCelda);
        // ctx.fillStyle = jugador.color;
        // ctx.fillRect(
        //     jugador.x * tamanioCelda,
        //     jugador.y * tamanioCelda,
        //     jugador.size,
        //     jugador.size
        // );
    }
    let bombita = new Image();
    bombita.src = "bombita.png";
    function dibujarBombas() {
        bombas.forEach((bomba) => {
            ctx.drawImage(bombita, bomba.x * tamanioCelda, bomba.y * tamanioCelda);
            // ctx.fillStyle = "black";
            // ctx.fillRect(
            //     bomba.x * tamanioCelda,
            //     bomba.y * tamanioCelda,
            //     tamanioCelda,
            //     tamanioCelda
            // );
        });
    }
    
    function pintarBomba(x, y) {
        if (!bombaActiva && mapa[y][x] === 0) {
            bombas.push({ x, y, timer: 3000 });
        }
        bombaActiva = true;
    }
    
    function puedoMoverme(nuevoX, nuevoY) {
        // Comprobar si hay una bomba en la nueva posición
        for (let bomba of bombas) {
            if (bomba.x === nuevoX && bomba.y === nuevoY) {
                return false; // No puedes moverte si hay una bomba en esta posición
            }
        }
        
        return (
            nuevoX >= 0 &&
            nuevoX < columnas &&
            nuevoY >= 0 &&
            nuevoY < filas &&
            mapa[nuevoY][nuevoX] === 0
        );
    }
    
    
    function moverJugador(dx, dy) {
        const nuevoX = jugador.x + dx;
        const nuevoY = jugador.y + dy;
        
        
        if (puedoMoverme(nuevoX, nuevoY)) {
            jugador.x = nuevoX;
            console.log("jugador en x " + jugador.x);
            jugador.y = nuevoY;
        }
    }
    const sonidoExplosion = new Audio("sonidoExplosion.mp3");
    
    function crearExplosion(x, y) {
        const rangoExplosion = 1;
        explosiones.push({ x, y, range: rangoExplosion, timer: 1500 });
        sonidoExplosion.play();
        
        for (let i = 1; i <= rangoExplosion; i++) {
            if (x + i < columnas && mapa[y][x + i] !== 2) {
                if (mapa[y][x + i] === 1) {
                    mapa[y][x + i] = 0;
                }
            }
            
            if (x - i >= 0 && mapa[y][x - i] !== 2) {
                if (mapa[y][x - i] === 1) {
                    mapa[y][x - i] = 0;
                }
            }
            
            if (y + i < filas && mapa[y + i][x] !== 2) {
                if (mapa[y + i][x] === 1) {
                    mapa[y + i][x] = 0;
                }
            }
            
            if (y - i >= 0 && mapa[y - i][x] !== 2) {
                if (mapa[y - i][x] === 1) {
                    mapa[y - i][x] = 0;
                }
            }
        }
        verificarVictoria()
    }
    
    let explosionCen = new Image();
    explosionCen.src = "explosion.png";
    let explosionAbajo = new Image();
    explosionAbajo.src = "explosionAba.png";
    let explosionArriba = new Image();
    explosionArriba.src = "explosionArri.png";
    let explosionIzquierda = new Image();
    explosionIzquierda.src = "explosionIzq.png";
    let explosionDerecha = new Image();
    explosionDerecha.src = "explosionDe.png";
    
    
    function dibujarExplosion() {
        explosiones.forEach((explosion, index) => {
            
            
            if (explosion.timer > 0) {
                if (!explosion.sonidoReproducido) {
                    sonidoExplosion.play();
                    explosion.sonidoReproducido = true;  // Marcar que ya se reprodujo el sonido
                }
                ctx.fillStyle = "orange";
                ctx.drawImage(
                    explosionCen,
                    explosion.x * tamanioCelda,
                    explosion.y * tamanioCelda
                );
                // ctx.fillRect(
                //     explosion.x * tamanioCelda,
                //     explosion.y * tamanioCelda,
                //     tamanioCelda,
                //     tamanioCelda
                // );
                
                for (let i = 1; i <= explosion.range; i++) {
                    if (
                        explosion.x + i < columnas &&
                        mapa[explosion.y][explosion.x + i] !== 2
                    ) {
                        ctx.drawImage(
                            explosionDerecha,
                            (explosion.x + i) * tamanioCelda,
                            explosion.y * tamanioCelda
                        );
                        // ctx.fillRect(
                        //     (explosion.x + i) * tamanioCelda,
                        //     explosion.y * tamanioCelda,
                        //     tamanioCelda,
                        //     tamanioCelda
                        // ); // Explocion en Derecha
                    }
                    if (explosion.x - i >= 0 && mapa[explosion.y][explosion.x - i] !== 2) {
                        ctx.drawImage(
                            explosionIzquierda,
                            (explosion.x - i) * tamanioCelda,
                            explosion.y * tamanioCelda
                        );
                        // ctx.fillRect(
                        //     (explosion.x - i) * tamanioCelda,
                        //     explosion.y * tamanioCelda,
                        //     tamanioCelda,
                        //     tamanioCelda
                        // ); // Explocion enIzquierda
                    }
                    if (
                        explosion.y + i < filas &&
                        mapa[explosion.y + i][explosion.x] !== 2
                    ) {
                        ctx.drawImage(
                            explosionAbajo,
                            explosion.x * tamanioCelda,
                            (explosion.y + i) * tamanioCelda
                        );
                        // ctx.fillRect(
                        //     explosion.x * tamanioCelda,
                        //     (explosion.y + i) * tamanioCelda,
                        //     tamanioCelda,
                        //     tamanioCelda
                        // ); // Explosion hacia Abajo
                    }
                    if (explosion.y - i >= 0 && mapa[explosion.y - i][explosion.x] !== 2) {
                        ctx.drawImage(
                            explosionArriba,
                            explosion.x * tamanioCelda,
                            (explosion.y - i) * tamanioCelda
                        );
                        // ctx.fillRect(
                        //     explosion.x * tamanioCelda,
                        //     (explosion.y - i) * tamanioCelda,
                        //     tamanioCelda,
                        //     tamanioCelda
                        // ); // Explosion hacia Arriba
                    }
                }
                
                explosion.timer -= 100;
                
                if (explosion.timer <= 0) {
                    explosiones.splice(index, 1);
                }
            }
            
        });
    }
    
    function jugadorEnExplosion(
        jugadorX,
        jugadorY,
        bombaX,
        bombaY,
        rangoExplosion
    ) {
        if (jugadorX === bombaX && jugadorY === bombaY) {
            return true;
        }
        
        const direcciones = [
            { dx: 0, dy: -1 }, // Arriba
            { dx: 0, dy: 1 }, // Abajo
            { dx: -1, dy: 0 }, // Izquierda
            { dx: 1, dy: 0 }, // Derecha
        ];
        
        for (let direccion of direcciones) {
            for (let pasos = 1; pasos <= rangoExplosion; pasos++) {
                const explosionX = bombaX + direccion.dx * pasos;
                const explosionY = bombaY + direccion.dy * pasos;
                
                if (jugadorX === explosionX && jugadorY === explosionY) {
                    jugador.x = 1;
                    jugador.y = 1;
                    return true;
                }
            }
        }
        
        return false;
    }
    
    function detonarBomba() {
        bombas.forEach((bomba, index) => {
            bomba.timer -= 100;
            
            if (bomba.timer <= 0) {
                crearExplosion(bomba.x, bomba.y);
                
                if (jugadorEnExplosion(jugador.x, jugador.y, bomba.x, bomba.y, 1)) {
                    console.log("¡El jugador fue alcanzado por la explosión!");
                    jugador.health -= 1;
                    if (jugador.health <= 0) {
                        console.log("¡El jugador ha sido derrotado!");
                    }
                }
                
                bombas.splice(index, 1);
                bombaActiva = false;
            }
        });
    }
    
    
    function rashoSonicos(x, y, rangoExplosion = 12) {
        
        if (jugador.health <= 1) {
            console.log("No tienes más vidas para usar la función.");
            return;
        }else{
            sonidoExplosion.play();
            
            jugador.health--;
            const direcciones = {
                'up': { dx: 0, dy: -1 }, // Arriba
                'down': { dx: 0, dy: 1 }, // Abajo
                'left': { dx: -1, dy: 0 }, // Izquierda
                'right': { dx: 1, dy: 0 }  // Derecha
            };
            
            const direccion = direcciones[jugador.direccion];
            if (!direccion) return;
            
            let bloquesDestruidos = 0;
            
            const destruirBloque = (nuevoX, nuevoY, i) => {
                if (nuevoX >= 0 && nuevoX < columnas && nuevoY >= 0 && nuevoY < filas) {
                    if (mapa[nuevoY][nuevoX] === 2) {
                        return; // Detener si encuentra una pared indestructible
                    }
                    
                    if (mapa[nuevoY][nuevoX] === 1) {
                        ctx.fillStyle = "orange";
                        ctx.fillRect(
                            nuevoX * tamanioCelda,
                            nuevoY * tamanioCelda,
                            tamanioCelda,
                            tamanioCelda
                        );
                        ctx.stroke();
                        
                        setTimeout(() => {
                            mapa[nuevoY][nuevoX] = 0;
                            bloquesDestruidos++;
                            ctx.clearRect(
                                nuevoX * tamanioCelda,
                                nuevoY * tamanioCelda,
                                tamanioCelda,
                                tamanioCelda
                            );
                            pintarMapa();
                            dibujarJugador();
                            
                            if (i === rangoExplosion || mapa[nuevoY][nuevoX] === 2) {
                                setTimeout(() => verificarVictoria(), 100);
                            }
                        }, 300); 
                        
                        return;
                    }
                }
                
            };
            
            for (let i = 0; i <= rangoExplosion; i++) {
                const nuevoX = x + direccion.dx * i;
                const nuevoY = y + direccion.dy * i;
                setTimeout(() => destruirBloque(nuevoX, nuevoY, i), i * 100);
            }
        }
    }
    
    
    
    let pausa = false;
    
    function contador(){       
        const timeoutId = setTimeout(function(){
        }, 1000);
        
        ctx.fillStyle ='rgb(1, 201, 241)';
        ctx.font ="50px Arial"
        ctx.fillText("Time : "+ (timeoutId/100), 500, canvas.height - 20);
        
        ctx.fillStyle = "rgb(1, 201, 241)";
        ctx.font = "50px Arial";
        ctx.fillText(`Vidas: ${jugador.health}`, 100, canvas.height - 10);
        
        
        if ((timeoutId/100) >120.99||jugador.health===0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';  
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "50px Arial";
            ctx.fillStyle = "red";
            ctx.fillText("¡Perdiste!", canvas.width / 2 - 150, canvas.height / 2);
            return true;
        }
    }
    
    function verificarVictoria() {
        let hayBloquesDestructibles = false;
        for (let y = 0; y < filas; y++) {
            for (let x = 0; x < columnas; x++) {
                if (mapa[y][x] === 1) {
                    hayBloquesDestructibles = true;
                    break;
                }
            }
            if (hayBloquesDestructibles) break;
        }
        
        if (!hayBloquesDestructibles) {
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';  
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "50px Arial";
            ctx.fillStyle = "green";
            ctx.fillText("Ganaste!", canvas.width / 2 - 150, canvas.height / 2);
            return true;
        }
    }
    
    function alternarPausa() {
        pausa = !pausa; 
        if (!pausa) {
            cicloJuego();
        } else {
            musicaAmbiental.pause(); 
        }
    }
    
    
    window.addEventListener("keydown", function (e) {
        
        
        if (e.code === "ArrowUp") {
            moverJugador(0, -1);
            jugador.direccion = 'up';
        }
        if (e.code === "ArrowDown") {
            moverJugador(0, 1);
            jugador.direccion = 'down';
        }
        if (e.code === "ArrowLeft") {
            moverJugador(-1, 0);
            jugador.direccion = 'left';
        }
        if (e.code === "ArrowRight") {
            moverJugador(1, 0);
            jugador.direccion = 'right';
        }
        if (e.code === "Space") pintarBomba(jugador.x, jugador.y);
        if (e.code === "KeyR") rashoSonicos(jugador.x, jugador.y);
        if (e.code === "KeyP") pausa = !pausa;
        if (e.code==="KeyJ")cicloJuego();
    });
    
    
    function instruccion() {
        ctx.fillStyle="black"
        ctx.fillRect(1200,0,400,900);
    }
    
    
    function cicloJuego() {
        if (!pausa) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pintarMapa();
            dibujarJugador();
            dibujarBombas();
            dibujarExplosion();
            detonarBomba();
            contador();
            if (contador()){
                console.log("perdi")
                return;
            }
            if (verificarVictoria()){
                return
            }
        }else{
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'red';
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            ctx.fillText("P A U S A", 520, 200);
            
            ctx.fillStyle = 'white';
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            ctx.fillText("Instrucciones:", canvas.width / 2, canvas.height / 2 - 60);
            ctx.font = "20px Arial";
            ctx.fillText("Flechas de dirección para moverse", canvas.width / 2, canvas.height / 2 - 20);
            ctx.fillText("Espacio para colocar una bomba", canvas.width / 2, canvas.height / 2 + 20);
            ctx.fillText("R para lanzar el rayo sonico", canvas.width / 2, canvas.height / 2 + 60);
            ctx.fillText("P para pausar el juego", canvas.width / 2, canvas.height / 2 + 100);
        }
        
        
        
        requestAnimationFrame(cicloJuego);  
        
    }
    
    