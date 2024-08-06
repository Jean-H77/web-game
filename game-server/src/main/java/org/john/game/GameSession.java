package org.john.game;

import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;

public record GameSession(Channel channel) {

    public void readPacket() {

    }

    public void writePacket(GamePacket gamePacket) {
        channel.writeAndFlush(new BinaryWebSocketFrame(Unpooled.wrappedBuffer(gamePacket.toBytes())));
    }

    public void close() {
        channel.close();
    }
}
