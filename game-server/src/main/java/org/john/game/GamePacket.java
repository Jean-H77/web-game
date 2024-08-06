package org.john.game;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

public record GamePacket(
        int id,
        byte[] payload
) {

    public byte[] toBytes() {
        ByteBuf byteBuf = Unpooled.buffer();
        byteBuf.writeByte(id);
        byteBuf.writeByte(payload.length);
        byteBuf.writeBytes(payload);
        return byteBuf.array();
    }
}
