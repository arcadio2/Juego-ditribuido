let order = [];
let socket = io('http://localhost:3000');

socket.on('connection', (socket) => {
    console.log(socket.id);
  });