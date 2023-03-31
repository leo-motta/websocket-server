const  express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(__dirname + '/../public'))

const clients : Array<any>  = [];

io.on('connection', (client) => {
    console.log(`Client connected ${client.id}`);
    clients.push(client);

    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1);
        console.log(`Client disconnected ${client.id}`);
    });

    //TESTE
    client.on('reply', () => { console.log("a reply detected!")});
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

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});