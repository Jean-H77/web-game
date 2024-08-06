package org.john.game;

import io.netty.channel.Channel;
import org.john.Player;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class World {

    private static final List<Player> players = new ArrayList<>();

    public static void addPlayer(Player player) {
        players.add(player);
        player.login();
        updateOtherWorldPlayerList(player);
    }

    public static void removePlayer(Channel channel) {
        Optional<Player> playerOptional =  players.stream().filter(plr -> plr.getGameSession().channel().equals(channel)).findFirst();

        playerOptional.ifPresent((p) -> {
            players.remove(p);
            p.getGameSession().close();
        });
    }

    public static void removePlayer(Player player) {
        players.remove(player);
        player.getGameSession().close();
    }

    public static void updateOtherWorldPlayerList(Player playerToAdd) {
        for (Player player : players) {
            if(player.equals(playerToAdd)) {
                continue;
            }
            GameSession gameSession = player.getGameSession();
            GamePacket gamePacket = new GamePacket(1, playerToAdd.getName().getBytes());
            gameSession.writePacket(gamePacket);
        }
    }

    public static List<Player> getPlayers() {
        return players;
    }
}
