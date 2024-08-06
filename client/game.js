const START_POSITION_X = 500;
const START_POSITION_Y = 360;

const canvas = document.getElementById("myCanvas")
const canvasCtx = canvas.getContext("2d");

class Game {
    static instance = null;

    constructor() {
        if (Game.instance) {
            return Game.instance;
        }
        
        this.players = new Map();
        this.myPlayer = null;
        this.isRunning = false;
        this.canvas = document.getElementById("myCanvas");
        this.canvasCtx = this.canvas.getContext("2d");

        Game.instance = this;
    }

    addPlayer = (player) => {
        this.players.set(player.name, player);

        const Playerlist = document.getElementById('playerList');
        const listElement = document.createElement('li');
        listElement.textContent = player.name;
        listElement.id = player.name;

        Playerlist.append(listElement);
    }

    drawPlayer = (player) => {
        canvasCtx.beginPath();
        canvasCtx.arc(player.xPos, player.yPos, 10, 2 * Math.PI, false);
        canvasCtx.stroke();

        this.canvasCtx.font = '12px Arial';
        this.canvasCtx.fillStyle = 'black';
        this.canvasCtx.textAlign = 'center';
        this.canvasCtx.textBaseline = 'middle';
        this.canvasCtx.fillText(player.name, player.xPos, player.yPos - 15);
    }

    update = () => {
        canvasCtx.clearRect(0, 0, 1280, 720);
        if (this.myPlayer) {
            this.myPlayer.handleKeyPressed();
        }

        for(const [name, plr] of this.players) {
            this.drawPlayer(plr);
        }
    }

    updatePlayers = (decoder, packetId, payload) => {
        const offset = payload[0];
        const name = decoder.decode(payload.slice(1, offset+1));
        const xPos = byteArrayToFloat(payload.slice(offset+1, offset+5));
        const yPos = byteArrayToFloat(payload.slice(offset+5, offset+9));
        
        this.players.get(name).xPos = xPos;
        this.players.get(name).yPos = yPos;

        console.log(`Updooting players ${name}`);
    }
    
    start = () => {
        this.isRunning = true;
        setInterval(this.update, 1000/60);
    }
}

instance = new Game();
const customEvent = new CustomEvent('myCanvas');

instance.canvas.addEventListener('click', () => {
    document.dispatchEvent(customEvent);
});

document.addEventListener('myCanvas', () => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
});

instance.canvas.addEventListener('blur', () => {
    if (instance.myPlayer) {
        for (let key in instance.myPlayer.keysPressed) {
            instance.myPlayer.keysPressed[key] = false;
        }
    }
});

handleKeyDown = (event) => {
    if (!instance.myPlayer) {
        return;
    }

    instance.myPlayer.keysPressed[event.key] = true;
    instance.myPlayer.handleKeyPressed();

    if (instance.myPlayer.needsUpdate) {
        instance.drawPlayer(instance.myPlayer);
    }
}

handleKeyUp = (event) => {
    if (instance.myPlayer) {
        instance.myPlayer.keysPressed[event.key] = false;
    }
}

instance.canvas.tabIndex = 0;
