
let order = [];
let playerOrder = [];
let flash;
let turn;
let good;
let compTurn;
let intervalId;
let strict = true;
let noise = true;
let on = false;
let win;
let contador = 0;
let socket = io('http://192.168.20.65:4000');
let activardiv;
let players = 0;
let enterf=true; 
let turno;
let turnos = [];
let miTurno = true;
let ledi=true; 

socket.on('connect', (socket) => {
  console.log("Has entrado a la partida c:");
});

socket.on('cambio-turno', (data) => {
  turno = data;
  console.log(data);
  console.log(turnos[0][data]);

  if (turnos[0][data] == document.getElementById('nombre').value) {
    miTurno = true;
    document.getElementById('tu').innerHTML = "ES tu turno"
  } else {
    miTurno = false;
    document.getElementById('tu').innerHTML = "Turno contrario"
  }
});

socket.on('discon', (data) => {
  console.log(data);
});
socket.on('newcon', (data) => {
  if (data.length == 2) {
    turnos.push(data);
    console.log(turnos);
    turno = 0;
    on = true;
    socket.emit('turno-server', turno);
    document.getElementById('Esperando').innerHTML = "Jugadores conectados: <p> " + data[0] + '</p><p>' + data[1] + '</p>';
    document.getElementById('sendname').disabled = true;
    enterf=false; 
  } else if (data.length == 1) {
    document.getElementById('Esperando').textContent = "Esperando jugadores...";
    on = false;//manda undefined los turnos, el array, ya vi. hmmmm
  } else if (data.length > 2) {
    document.getElementById('sendname').disabled = true;
    document.getElementById('mas').textContent = "no mas de dos"
  }
  if (data.length == 2 && (on || win)) {
    play();
  }
});

socket.on('lista', (data) => {
  console.log("LISTA DE SOCKETS", data)
});

socket.on('lose-cliente', (data) => {
  for (let index = 0; index < 2; index++) {
    if (turnos[0][index] != data) {
      alert("A ganado: " + turnos[0][index]);
      break;
    }
  }

});

socket.on('orderc', (data) => {
  order = data;
});

socket.on('turno-booleano', (booleano) => {
  miTurno = booleano;
});

socket.on('topLeft-cliente', (data) => {
  contador = data.contador;
  playerOrder = data.playerOrder;
  check();
  one();
  if (!win) {
    setTimeout(() => {
      clearColor();
    }, 300);
  }
});

socket.on('topRight-cliente', (data) => {
  contador = data.contador;
  playerOrder = data.playerOrder;
  check();
  two();
  if (!win) {
    setTimeout(() => {
      clearColor();
    }, 300);
  }
});

socket.on('bottomLeft-cliente', (data) => {
  contador = data.contador;
  playerOrder = data.playerOrder;
  check();

  three();
  if (!win) {
    setTimeout(() => {
      clearColor();
    }, 300);
  }
});

socket.on('bottomRight-cliente', (data) => {
  contador = data.contador;
  playerOrder = data.playerOrder;
  check();
  four();
  if (!win) {
    setTimeout(() => {
      clearColor();
    }, 300);
  }
});


function setNombre() {
  if (!document.getElementById('nombre').value || document.getElementById('nombre').value.length < 1) {
    document.getElementById('username').textContent = "Ingresa un nombre";
  } else {
    ledi=false;
    document.getElementById('nombre').setAttribute('readonly', 'readonly');
    players++;
    document.getElementById('username').textContent = document.getElementById('nombre').value;
    socket.emit('nombre', document.getElementById('nombre').value);
    if (order.length < 1) {
      for (var i = 0; i < 50; i++) {
        order.push(Math.floor(Math.random() * 4) + 1);
      }
      socket.emit('order', order);
    }
    document.getElementById('sendname').disabled = true;
  }
}

document.getElementById('nombre').addEventListener('keypress', (event) => {
    if (event.keyCode == 13 && enterf && ledi) {
      setNombre();
    }
});

const turnCounter = document.querySelector("#turn");
const topLeft = document.querySelector("#topleft");
const topRight = document.querySelector("#topright");
const bottomLeft = document.querySelector("#bottomleft");
const bottomRight = document.querySelector("#bottomright");
topLeft.onclick = false;
topRight.onclick = false;
bottomRight.onclick = false;
bottomLeft.onclick = false;
/*
topLeft.disabled=true; 
topRight.disabled=true; 
bottomLeft.disabled=true; 
bottomRight.disabled=true; 
*/



function play() {

  win = false;
  flash = 0;
  intervalId = 0;
  turn = 1;
  turnCounter.innerHTML = 1;
  good = true;
  compTurn = true;
  intervalId = setInterval(gameTurn, 800);
}

function gameTurn() {
  on = false;
  if (flash == turn) {
    clearInterval(intervalId);
    compTurn = false;
    clearColor();
    on = true;
  }

  if (compTurn) {
    clearColor();
    setTimeout(() => {
      if (order[flash] == 1) one();
      if (order[flash] == 2) two();
      if (order[flash] == 3) three();
      if (order[flash] == 4) four();
      flash++;
    }, 200);
  }
}

function one() {
  if (noise) {
    let audio = document.getElementById("clip1");
    audio.play();
  }
  noise = true;
  topLeft.style.backgroundColor = "lightgreen";
}

function two() {
  if (noise) {
    let audio = document.getElementById("clip2");
    audio.play();
  }
  noise = true;
  topRight.style.backgroundColor = "tomato";
}

function three() {
  if (noise) {
    let audio = document.getElementById("clip3");
    audio.play();
  }
  noise = true;
  bottomLeft.style.backgroundColor = "yellow";
}

function four() {
  if (noise) {
    let audio = document.getElementById("clip4");
    audio.play();
  }
  noise = true;
  bottomRight.style.backgroundColor = "lightskyblue";
}

function clearColor() {
  topLeft.style.backgroundColor = "darkgreen";
  topRight.style.backgroundColor = "darkred";
  bottomLeft.style.backgroundColor = "goldenrod";
  bottomRight.style.backgroundColor = "darkblue";
}

function flashColor() {
  topLeft.style.backgroundColor = "lightgreen";
  topRight.style.backgroundColor = "tomato";
  bottomLeft.style.backgroundColor = "yellow";
  bottomRight.style.backgroundColor = "lightskyblue";
}


topLeft.addEventListener('click', (event) => {
  if (on && miTurno) {
    contador++;
    playerOrder.push(1);

    socket.emit('topLeft', {
      "contador": contador,
      "playerOrder": playerOrder
    });
  }
})



topRight.addEventListener('click', (event) => {
  if (on && miTurno) {
    contador++;
    playerOrder.push(2);

    socket.emit('topRight', {
      "contador": contador,
      "playerOrder": playerOrder
    });
  }
});

bottomLeft.addEventListener('click', (event) => {
  if (on && miTurno) {
    contador++;
    playerOrder.push(3);

    socket.emit('bottomLeft', {
      "contador": contador,
      "playerOrder": playerOrder
    });
  }
})

bottomRight.addEventListener('click', (event) => {
  if (on && miTurno) {
    contador++;
    playerOrder.push(4);

    socket.emit('bottomRight', {
      "contador": contador,
      "playerOrder": playerOrder
    });
  }
});

function check() {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
    good = false;

  if (playerOrder.length == 15 && good) {
    winGame();
  }

  if (good == false) {
    flashColor();
    turnCounter.innerHTML = "PERDISTE!";
    contador = 0;
    if (miTurno) {
      socket.emit('lose', document.getElementById('nombre').value);
    }
    setTimeout(() => {
      turnCounter.innerHTML = turn;
      clearColor();

      if (strict) {
        window.location.reload(true);
      } else {
        compTurn = true;
        flash = 0;
        playerOrder = [];
        good = true;
        intervalId = setInterval(gameTurn, 800);
      }
    }, 800);

    noise = false;
  }

  if (turn == playerOrder.length && good && !win) {
    socket.emit('turno-server', turno);
    turn++;
    playerOrder = [];
    compTurn = true;
    flash = 0;
    turnCounter.innerHTML = turn;
    intervalId = setInterval(gameTurn, 800);
  }

}

function winGame() {
  flashColor();
  turnCounter.innerHTML = "WIN!";
  contador = 0;
  on = false;
  win = true;
  socket.emit('win', 'Han Ganado jeje');
}






