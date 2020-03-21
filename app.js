const handlebars = require('express-handlebars');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const SocketIO = require('socket.io');
const session = require('cookie-session');
const app = express();

app.set('trust proxy', 1);
app.use(session({
    secret: 'clave secretosa',
    resave: false,
    saveUninitialized: true
}));

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'src/views'));
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.use(express.json());

//configurar middlewares
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));

app.use('/', require('./src/rutas/rutas'));

//Archivos estáticos
app.use(express.static(path.join(__dirname, 'src/public')));

//Inicializar servidor 
//Inicializar servidor 
const serverU = app.listen(app.get('port'), () => {
    console.log(`SERVER IN PORT ${app.get('port')}`);
});
const io = SocketIO(serverU);
let conexiones = 0;
let contador = 0;
let listasockets = [];

io.on('connection', (socket) => {
    conexiones++;
    if(conexiones>2) console.log("MAs de dos", conexiones); 
    //socket para el usuario
    io.emit('usuario', {
        "id_us": socket.id
    });
    socket.on('playerOrder', (data) => {
        console.log(data)
        io.sockets.emit('playerOrder', data);
    });

    socket.on('nombre', (nombre) => {
        socket.id = nombre;
        console.log(socket.id);
        listasockets.push(socket.id);
        console.log("La lista de sockets " + listasockets)
        console.log('new connection', socket.id);
        io.emit('newcon', listasockets);
        //emitir la lista de sockets
        io.emit('lista', listasockets);
    });

    socket.on('lose', (data) => {
        console.log("el data es " + data);
        io.sockets.emit('lose-cliente', data);
    });
    socket.on('order', (data) => {
        console.log(`El orden recibido del servidor es ${data}`);
        io.sockets.emit('orderc', data);
    });

    socket.on('topLeft', (data) => {
        console.log(data);
        
        io.sockets.emit('topLeft-cliente', (data));
    });

    socket.on('topRight', (data) => {
        console.log(data);
        io.sockets.emit('topRight-cliente', (data));
    });

    socket.on('bottomLeft', (data) => {
        console.log(data);
        io.sockets.emit('bottomLeft-cliente', (data));
    });

    socket.on('bottomRight', (data) => {
        console.log(data);
        io.sockets.emit('bottomRight-cliente', (data));
    });

    socket.on('turno-server', (turno) => {
        if (turno == 1) {
            turno = 0;
        }else{
            turno++;
        }
        io.sockets.emit('cambio-turno', (turno));
    });

    //cuando se desconecta
    socket.on('disconnect', () => {
        conexiones--;
        for (let i = 0; i < listasockets.length; i++) {
            if (socket.id == listasockets[i]) listasockets.splice(i)
        }
        io.emit('newcon',
            {
                "con": 'Nueva coneccion',
                "conexiones": conexiones
            });
        io.emit('lista', listasockets);
        console.log("alguien se ha desconectado", socket.id);
    });
});

