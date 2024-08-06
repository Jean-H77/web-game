package org.john.game.engine;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import org.john.Player;
import org.john.game.GamePacket;
import org.john.game.World;

public class GameLoop implements Runnable {

    private boolean running = true;

    @Override
    public void run() {
        final int TARGET_FPS = 60;
        final long OPTIMAL_TIME = 1000000000 / TARGET_FPS;
        long lastTime = System.nanoTime();
        long timer = System.currentTimeMillis();

        while (running) {
            long now = System.nanoTime();
            long updateLength = now - lastTime;
            lastTime = now;
            double delta = updateLength / ((double) OPTIMAL_TIME);

            for (Player me : World.getPlayers()) {
                me.getGameSession().writePacket(new GamePacket(3, getPlayerUpdateBuffer(me)));

                for (Player other : World.getPlayers()) {
                    if(other.equals(me)) {
                        continue;
                    }
                    System.out.println("Updooting " + other.getName() + " for client: " + me.getName());
                    byte[] bytes = getPlayerUpdateBuffer(other);
                    me.getGameSession().writePacket(new GamePacket(3, bytes));
                }
            }

            if (System.currentTimeMillis() - timer >= 1000) {
                timer += 1000;
            }

            try {
                long sleepTime = (lastTime - System.nanoTime() + OPTIMAL_TIME) / 1000000;
                if (sleepTime > 0) {
                    Thread.sleep(sleepTime);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void start() {
        running = true;
    }

    public void stop() {
        running = false;
    }

    public byte[] getPlayerUpdateBuffer(Player player) {
        ByteBuf byteBuf = Unpooled.buffer();
        byteBuf.writeByte(player.getName().length());
        byteBuf.writeBytes(player.getName().getBytes());
        byteBuf.writeFloatLE(player.getPosition().getX());
        byteBuf.writeFloatLE(player.getPosition().getY());
        return byteBuf.copy().array();
    }
}
