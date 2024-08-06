package org.john.net;

import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.handler.codec.http.websocketx.*;
import io.netty.util.AttributeKey;
import org.john.Player;
import org.john.game.GameSession;
import org.john.game.World;

import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

@ChannelHandler.Sharable
public class WebSocketHandler extends SimpleChannelInboundHandler<Object> {

    private static final Logger LOGGER = Logger.getLogger(WebSocketHandler.class.getName());
    public static final AttributeKey<Player> SESSION_KEY = AttributeKey.valueOf("session");

    @Override
    protected void channelRead0(ChannelHandlerContext channelHandlerContext, Object msg) {
         if (msg instanceof WebSocketFrame) {
            handleWebSocketFrame(channelHandlerContext, (WebSocketFrame) msg);
        }
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        ctx.flush();
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        String remoteAddress = ctx.channel().remoteAddress().toString();
        LOGGER.log(Level.SEVERE, "Exception caught from client " + remoteAddress, cause);
        World.removePlayer(ctx.channel());
        ctx.close();
    }

    private void handleWebSocketFrame(ChannelHandlerContext ctx, WebSocketFrame frame) {
        if (frame instanceof CloseWebSocketFrame) {
            System.out.println("Closing");
            ctx.channel().writeAndFlush(frame).addListener(ChannelFutureListener.CLOSE);
            return;
        }

        if (frame instanceof PingWebSocketFrame) {
            ctx.channel().write(new PongWebSocketFrame(frame.content().retain()));
            return;
        }

        if(frame instanceof BinaryWebSocketFrame) {
            ByteBuf content = frame.content();
            int packetId = content.readUnsignedByte();

            switch (packetId) {
                case 1:
                    byte[] nameBytes = new byte[content.readableBytes()];
                    content.readBytes(nameBytes);
                    String name = new String(nameBytes);
                    Player player = new Player(new GameSession(ctx.channel()), name);
                    System.out.println("Size: " + World.getPlayers().size());
                    Optional<Player> optionalPlayer = World.getPlayers().stream().filter(p -> p.getName().equals(player.getName())).findFirst();
                    if(optionalPlayer.isPresent()) {
                        System.out.println("Contains");
                        World.removePlayer(optionalPlayer.get());
                    }
                    World.addPlayer(player);
                    ctx.channel().attr(SESSION_KEY).set(player);
                    break;
                case 3:
                    float xPos = content.readFloatLE();
                    float yPos = content.readFloatLE();
                    Player p = ctx.channel().attr(SESSION_KEY).get();
                    p.getPosition().setX(xPos);
                    p.getPosition().setY(yPos);
                    break;
            }

            return;
        }

        if (!(frame instanceof TextWebSocketFrame)) {
            throw new UnsupportedOperationException(String.format("%s frame types not supported", frame.getClass()
                    .getName()));
        }
    }
}
