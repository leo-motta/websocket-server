const  express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const mqtt = require('mqtt')
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
});

//MQTT
const mqtt_host = 'broker.emqx.io'
const mqtt_port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${mqtt_host}:${mqtt_port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

const topic = '/nodejs/mqtt'
client.on('connect', () => {
  console.log('MQTT Connected')

  client.subscribe([topic], () => {
    console.log(`Subscribed to topic '${topic}'`)
  })
})

client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())

    try {
        const payloadObject = JSON.parse(payload);
        console.log(payloadObject);
        io.emit('mqttData',payloadObject);
    } catch (err) {
        console.error(`Error parsing JSON: ${err}`);
    }
})

// Server
server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});