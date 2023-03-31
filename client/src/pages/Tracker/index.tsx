import React from 'react'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    transports: ['websocket']
});

export default function Tracker() {
    
    useEffect(() => {
        socket.connect();
        socket.emit("reply");
    }, []);

    return (
        <div>
            <h1>Olá Mundo</h1>
        </div>
    )
}
