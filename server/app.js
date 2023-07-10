
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import http from 'http';
import { Server } from 'socket.io'

const app = express();

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    path: "/api/socket.io",
    cors: {
        origin: ['http://localhost:3000'],
        methods: ["GET", "POST"]
    }
})

import authentication from './routes/authentication.js'
import manufacturer from './routes/manufacturer.js'
import transporter from './routes/transporter.js'
import common from './routes/common.js'
import chat from './routes/chat.js'


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(cors());

const CONNECTION_URL = process.env.DATABASE;
const PORT = process.env.PORT || 5000;


let users = []

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}


io.on("connection", (socket) => {
   
    socket.on('addUser', userId => {
        addUser(userId, socket.id)
    })

    socket.on('send-message', ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

    socket.on("disconnect", () => {
        removeUser(socket.id)
    })
});

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
        console.log('Database is connected');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });


app.use('/authentication', authentication)
app.use('/manufacturer', manufacturer)
app.use('/transporter', transporter)
app.use('/common', common)
app.use('/chat', chat)


// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });



