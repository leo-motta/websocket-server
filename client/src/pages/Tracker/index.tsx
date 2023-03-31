import React from 'react'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    transports: ['websocket']
});



export default function Tracker() {
    const [socketData, setSocketData] = useState<null | any>(null);
    const [object,SetObject] = useState<any>({});
    
    useEffect(() => {
        socket.connect();
        socket.on('mqttData', (JSONdata)=>{
            setSocketData(JSON.stringify(JSONdata));
            SetObject(JSONdata);
        });
    }, []);

    return (
        <div>
            <h1>Web Socket Client</h1>
            <h2>Data: {socketData ? socketData : 'No data available!'}</h2>
            <h2>msg: {object.msg ? object.msg : 'No object!'}</h2>
        </div>
    )
}
