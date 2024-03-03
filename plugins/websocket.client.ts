import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
    if (process.server) return
    
    const wsProtocol = 'wss:'
    let socket = new WebSocket(`${wsProtocol}//testnet.osmosis.ws.explorers.guru/socket.io/?EIO=4&transport=websocket`)

    return {
        provide: {
            socket
        }
    }
})