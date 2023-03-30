const  express = require('express');
const app = require('express')();
app.use(express.static(__dirname + '/../public'))

const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

const clients : Array<any>  = [];

io.on('connection', (client) => {
    console.log(`Client connected ${client.id}`);
    clients.push(client);

    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1);
        console.log(`Client disconnected ${client.id}`);
    });
});

app.get('/msg', (req, res) => {
    const msg = req.query.msg || '';
    for(const client of clients) {
        client.emit('msg', msg);
    }

    res.json({
        ok: true
    });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});