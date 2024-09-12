const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const columnas = 13; 
const filas = 11; 
const tamanioCelda = 80; 


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
    health: 3,
};

let bombas = [];
let explosiones = [];

function pintarMapa() {
    for (let y = 0; y < filas; y++) {
        for (let x = 0; x < columnas; x++) {
            if (mapa[y][x] === 2) {
                ctx.fillStyle = "gray";
                ctx.fillRect(
                    x * tamanioCelda,
                    y * tamanioCelda,
                    tamanioCelda,
                    tamanioCelda
                );
            } else if (mapa[y][x] === 1) {
                ctx.fillStyle = "brown";
                ctx.fillRect(
                    x * tamanioCelda,
                    y * tamanioCelda,
                    tamanioCelda,
                    tamanioCelda
                );
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

function dibujarJugador() {
    ctx.fillStyle = jugador.color;
    ctx.fillRect(
        jugador.x * tamanioCelda,
        jugador.y * tamanioCelda,
        jugador.size,
        jugador.size
    );
}

function dibujarBombas() {
    bombas.forEach((bomba) => {
        ctx.fillStyle = "black";
        ctx.fillRect(
            bomba.x * tamanioCelda,
            bomba.y * tamanioCelda,
            tamanioCelda,
            tamanioCelda
        );
    });
}

function pintarBomba(x, y) {
    if (mapa[y][x] === 0) {
        bombas.push({ x, y, timer: 5000 });
    }
}

function puedoMoverme(nuevoX, nuevoY) {
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

function crearExplosion(x, y) {
    const rangoExplosion = 1; 
    explosiones.push({ x, y, range: rangoExplosion, timer: 500 });
    
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
}

function dibujarExplosion() {
    explosiones.forEach((explosion, index) => {
        if (explosion.timer > 0) {
            ctx.fillStyle = "orange";
            
            ctx.fillRect(
                explosion.x * tamanioCelda,
                explosion.y * tamanioCelda,
                tamanioCelda,
                tamanioCelda
            );
            
            for (let i = 1; i <= explosion.range; i++) {
                if (
                    explosion.x + i < columnas &&
                    mapa[explosion.y][explosion.x + i] !== 2
                ) {
                    ctx.fillRect(
                        (explosion.x + i) * tamanioCelda,
                        explosion.y * tamanioCelda,
                        tamanioCelda,
                        tamanioCelda
                    ); // Explocion en Derecha
                }
                if (explosion.x - i >= 0 && mapa[explosion.y][explosion.x - i] !== 2) {
                    ctx.fillRect(
                        (explosion.x - i) * tamanioCelda,
                        explosion.y * tamanioCelda,
                        tamanioCelda,
                        tamanioCelda
                    ); // Explocion enIzquierda
                }
                if (
                    explosion.y + i < filas &&
                    mapa[explosion.y + i][explosion.x] !== 2
                ) {
                    ctx.fillRect(
                        explosion.x * tamanioCelda,
                        (explosion.y + i) * tamanioCelda,
                        tamanioCelda,
                        tamanioCelda
                    ); // Explosion hacia Abajo
                }
                if (explosion.y - i >= 0 && mapa[explosion.y - i][explosion.x] !== 2) {
                    ctx.fillRect(
                        explosion.x * tamanioCelda,
                        (explosion.y - i) * tamanioCelda,
                        tamanioCelda,
                        tamanioCelda
                    ); // Explosion hacia Arriba
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
        }
    });
}

function cicloJuego() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pintarMapa();
    dibujarJugador();
    dibujarBombas();
    dibujarExplosion(); 
    detonarBomba();
    requestAnimationFrame(cicloJuego);
}

window.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp") moverJugador(0, -1);
    if (e.key === "ArrowDown") moverJugador(0, 1);
    if (e.key === "ArrowLeft") moverJugador(-1, 0);
    if (e.key === "ArrowRight") moverJugador(1, 0);
    if (e.key === " ") pintarBomba(jugador.x, jugador.y);
});

cicloJuego();
