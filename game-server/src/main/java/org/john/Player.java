package org.john;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import org.john.game.GamePacket;
import org.john.game.GameSession;
import org.john.game.World;

import java.util.Arrays;

public class Player {
    private static final float START_POSITION_X = 500;
    private static final float START_POSITION_Y = 360;

    private final GameSession gameSession;
    private final Position position;
    private final String name;

    public Player(GameSession gameSession, String name) {
        this.gameSession = gameSession;
        this.name = name;
        position = new Position(START_POSITION_X,START_POSITION_Y);
    }

    public Position getPosition() {
        return position;
    }

    public GameSession getGameSession() {
        return gameSession;
    }

    public String getName() {
        return name;
    }

    public void login() {
        ByteBuf byteBuf = Unpooled.buffer();
        byteBuf.writeBytes(name.getBytes());
        GamePacket loginPacket = new GamePacket(2, byteBuf.copy().array());
        gameSession.writePacket(loginPacket);

        for(Player p : World.getPlayers()) {
            if(p.equals(this)) {
                continue;
            }

            byteBuf.clear();
            byteBuf.writeByte(p.getName().length());
            byteBuf.writeBytes(p.getName().getBytes());
            byteBuf.writeFloatLE(p.position.getX());
            byteBuf.writeFloatLE(p.position.getY());

            GamePacket addPlayerPacket = new GamePacket(4, byteBuf.copy().array());
            gameSession.writePacket(addPlayerPacket);
        }
    }
}
