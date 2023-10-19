import { __dirname } from "./utils.js";
import express from 'express';
import handlebars from "express-handlebars";
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// archivos estáticos - carpeta public
app.use(express.static(`${__dirname}/public`));

// Motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars')

// Routes
app.use('/', viewsRouter);


const server = app.listen(8080, () => console.log('Running'))

// socket io - Se declara el servidor y se pasa como parámetro para la clase Server

const socketServer = new Server(server);

const messages = [];

socketServer.on('connection', socket => {
    console.log('Nuevo cliente online');

    socket.on('message',data => {
        messages.push(data);
        socketServer.emit('messageLogs',messages);
    })

    socket.on('authenticated', data => {
        // se envían todos los mensajes almacenados en messages solo al nuevo cliente.
        socket.emit('messageLogs', messages);
        socket.broadcast.emit('newUserConnected',data);

    })
});



