const UPDATE_PLAYERS_LIST_ID = 1;
const LOGIN_ID = 2;
const GAME_UPDATE_ID = 3;
const ADD_PLAYER_ID = 4;

const URI = 'ws://localhost:9000/game'
const game = new Game();

var socket;
var buffer = new ArrayBuffer(32);
var view = new Uint32Array(buffer);
var encoder = new TextEncoder();
var decoder = new TextDecoder();

document.addEventListener('DOMContentLoaded', (event) => {
    socket = new WebSocket(URI);
    socket.binaryType = 'arraybuffer'

    socket.onopen = () => {
        console.log('WebSocket connection established');
        game.start();
    };

    socket.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
            const view = new Uint8Array(event.data);

            const packetId = view[0];
            const payloadLength = view[1];
            const payload = view.slice(2, payloadLength+2);
            
          //  console.log(`Received packet: id: ${packetId} length: ${payloadLength} payload: ${payload}`)

            switch (packetId) {
                case UPDATE_PLAYERS_LIST_ID: 
                    const name = decoder.decode(payload);
                    const player = new Player(name, START_POSITION_X, START_POSITION_Y, null);
                    game.addPlayer(player);
                    console.log(`Other player joining ${name}`);
                    break;
                case LOGIN_ID:
                    login(payload);
                    break;
                case GAME_UPDATE_ID:
                    game.updatePlayers(decoder, packetId, payload);
                    break;
                case ADD_PLAYER_ID:
                    addPlayer(payload);
                    break;      
            }

        } else {
            console.log('Message received from server:', event.data);
        }
    };

    socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
});


const sendLoginRequest = (name) => {
    const playerNameBinary = encoder.encode(name);
    const packetId = 1;
    const buffer = new Uint8Array(playerNameBinary.length + 1);
    console.log("Sending login request");
    buffer[0] = packetId;
    buffer.set(playerNameBinary, 1);

    socket.send(buffer.buffer);
}

const login = (payload) => {
    const name = decoder.decode(payload);
    
    myPlayer = new Player(name, START_POSITION_X, START_POSITION_Y, socket);
    game.myPlayer = myPlayer;
    game.addPlayer(game.myPlayer);
}

const addPlayer = (payload) => {
    const offset = payload[0];
    const name = decoder.decode(payload.slice(1, offset+1));
    const xPos = byteArrayToFloat(payload.slice(offset+1, offset+5));
    const yPos = byteArrayToFloat(payload.slice(offset+5, offset+9));

    game.addPlayer(new Player(name, xPos, yPos, null));
}