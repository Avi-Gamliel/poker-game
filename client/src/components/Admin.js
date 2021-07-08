import React, { useRef, useEffect } from 'react'
import io from "socket.io-client";

function Admin() {
    const socketRef = useRef();
    useEffect(() => {
        socketRef.current = io.connect("/admin");
        socketRef.current.on('join', data => {
            console.log(data);
        })
    }, [])
    return (
        <div style={{ color: 'white' }}>



        </div>
    )

}

export default Admin
