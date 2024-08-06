
class Player {
    constructor(name, x, y, socket) {
        this.name = name;
        this.xPos =  x;
        this.yPos = y;
        this.keysPressed = {};
        this.isMoving = false;
        this.speed = 1.4;
        this.socket = socket;
        this.loggedIn = false;

        this.direction = 'n';

        this.spriteSheet = new Image();
        this.spriteSheetCols = 4;
        this.spriteSheetRows = 4;
        this.spriteSheet.src = "./Sprout Lands - Sprites - Basic pack/Characters/character.png";
        this.spriteSheetWidth = this.spriteSheet.width / this.spriteSheetCols;
        this.spriteSheetHeight = this.spriteSheet.height / this.spriteSheetRows;
        this.spriteSheetTotalFrames = 4;
        this.spriteSheetCurrentFrame = 0;
        this.spriteSheetSrcX = 0;
        this.spriteSheetSrcY = 0;
        this.spriteSheetFramesDrawn = 0;
    }

    resize = () => {
        let scaleFactor = 4;
        let midXPos = 1280 / 2 - (this.spriteSheetWidth * scaleFactor) / 2;
        let midYPos = 720 / 2 - (this.spriteSheetHeight * scaleFactor) / 2;


    }

    move = () => {
        let x = 0;
        let y = 0;
    
        if (this.keysPressed['w']) {
            y -= this.speed;
            this.direction = 'n';
        }
    
        if (this.keysPressed['s']) {
            y += this.speed;
            this.direction = 's';
        }
    
        if (this.keysPressed['d']) {
            x += this.speed;
            this.direction = 'e';
        }
    
        if (this.keysPressed['a']) {
            x -= this.speed;
            this.direction = 'w';
        }
    
        if (x !== 0 && y !== 0) {
            const diagonalSpeed = this.speed / Math.sqrt(2);
            x = (x > 0 ? diagonalSpeed : -diagonalSpeed);
            y = (y > 0 ? diagonalSpeed : -diagonalSpeed);
        }
    
        const packetId = 3;
        const buffer = new Uint8Array(9);
    
        buffer[0] = packetId;
    
        const xBytes = floatToByteArray(this.xPos + x);
        const yBytes = floatToByteArray(this.yPos + y);
    
        buffer.set(xBytes, 1); 
        buffer.set(yBytes, 5); 
        
        socket.send(buffer.buffer);
    }

    handleKeyPressed = () => {
        this.move();
    }
}

