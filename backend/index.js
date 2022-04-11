var express = require("express");
var app = express();
var cors = require("cors");
var server = require("http").createServer(app);

var io = require("socket.io")(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
});

app.use(cors());

var PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running.");
});

io.on("connection", (socket) => {
    socket.emit('me', socket.id);
    
    socket.on("disconnect", () => {
        socket.broadcast.emit("call ended");
    })

    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        console.log("here")
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answercall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});


});
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})


