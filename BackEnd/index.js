const express = require('express');
const appServer = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const { createServer } = require('http');
const cookieParser = require('cookie-parser');
// const { fetchMessage } = require('./Utilities/fetchMessage.js');
// const { deleteMessage } = require('./Utilities/deleteMessage.js');
const { userAuthRouter } = require('./Routers/userAuthRouter.js');
const { userDetailsRouter } = require('./Routers/userDetailsRouter.js');
const { handleFetchMessage } = require('./Utilities/handleFetchMessage.js');
const { handleDeleteMessage } = require('./Utilities/handleDeleteMessage.js');
require('dotenv').config();
// MiddleWares Setup
appServer.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));
appServer.use(express.json());
appServer.use('/Uploads', express.static('Uploads'));
appServer.use(express.urlencoded({ extended: true }));
appServer.use(cookieParser(process.env.COOKIE_SECRET_KEY));
// MongoDB Connection
const ConnectDB = async () => {
    try {
        const DB_Connection_Response = await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
        if (DB_Connection_Response) {
            console.log("DB_Connected_Successfully!");
        }
    } catch (error) {
        console.log(error);
    }
}
ConnectDB();
// Socket IO Config
const httpServer = createServer(appServer);
const SocketIO = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});
// api Routers
appServer.use('/api/auth', userAuthRouter);
appServer.use('/api/userDetail', userDetailsRouter);
// SocketIO Connection setup
// Tracking Socket.io Connected Users
const ConnectedUsers = new Map();
SocketIO.on("connection", (SocketInstance) => {
    // Listening to connection Session of users
    SocketInstance.on("connectSession", (SessionData) => {
        ConnectedUsers.set(SessionData.userID, SocketInstance.id);
    });
    // Listening to send Message Event
    SocketInstance.on("sendMessage", (MessageDetails) => {
        const parsedMessageDetails = JSON.parse(MessageDetails);
        (async function () {
            // const MessageFetchResponse = await fetchMessage(parsedMessageDetails);
            const MessageFetchResponse = await handleFetchMessage(parsedMessageDetails);
            if (MessageFetchResponse === "Message fetched Successfully!") {
                SocketIO.to(ConnectedUsers.get(parsedMessageDetails.userID)).emit("MessageFetchResponse", MessageFetchResponse);
                SocketInstance.to(ConnectedUsers.get(parsedMessageDetails.FriendUserID)).emit("MessageFetchResponse", MessageFetchResponse);
            }
            else {
                SocketIO.to(ConnectedUsers.get(parsedMessageDetails.userID)).emit("MessageFetchResponse", MessageFetchResponse);
                SocketInstance.to(ConnectedUsers.get(parsedMessageDetails.FriendUserID)).emit("MessageFetchResponse", MessageFetchResponse);
            }
        })();
    });
    // Listening to delete Message Event
    SocketInstance.on("deleteMessage", (MessageDetails) => {
        const parsedMessageDetails = JSON.parse(MessageDetails);
        (async function () {
            // const MessageDeleteResponse = await deleteMessage(parsedMessageDetails);
            const MessageDeleteResponse = await handleDeleteMessage(parsedMessageDetails);
            if (MessageDeleteResponse === "Message Deleted Successfully for user!") {
                SocketIO.to(ConnectedUsers.get(parsedMessageDetails.userID)).emit("MessageDeleteResponse", MessageDeleteResponse);
            }
            else if (MessageDeleteResponse === "Message Deleted Successfully for All!") {
                SocketIO.to(ConnectedUsers.get(parsedMessageDetails.userID)).emit("MessageDeleteResponse", MessageDeleteResponse);
                SocketInstance.to(ConnectedUsers.get(parsedMessageDetails.FriendUserID)).emit("MessageDeleteResponse", MessageDeleteResponse);
            }
            else {
                SocketIO.to(ConnectedUsers.get(parsedMessageDetails.userID)).emit("MessageDeleteResponse", MessageDeleteResponse);
                SocketInstance.to(ConnectedUsers.get(parsedMessageDetails.FriendUserID)).emit("MessageDeleteResponse", MessageDeleteResponse);
            }
        })();
    });
});
// AppServer is listening
appServer.listen(process.env.APPSERVER_PORT, () => {
    console.log(`AppServer is Listening on PORT: ${process.env.APPSERVER_PORT}`);
});
// SocketServer is listening
SocketIO.listen(process.env.SOCKET_IO_PORT, () => {
    console.log(`Socket Server is Listening on PORT: ${process.env.SOCKET_IO_PORT}`);
});