import { Id } from "convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "react-router";
import Players from "./components/Players";
import Rules from "./components/Rules";
import { Button } from "./components/ui/button";
import { toast } from "sonner";

export default function Room() {
  const { room_id } = useParams();

  const room = useQuery(api.rooms.get, {
    room_id: room_id as Id<"rooms">,
  });

  const createPlayer = useMutation(api.players.create);
  createPlayer({
    room_id: room_id as Id<"rooms">,
  });

  const players = useQuery(api.rooms.getPlayers, {
    room_id: room_id as Id<"rooms">,
  });

  const startGame = useMutation(api.rooms.start);

  async function startGameHandler() {
    if (!room) {
      toast.error("Room not found");
      return;
    }

    if (room.playing) {
      toast.error("Game already started");
      return;
    }

    if (!players) {
      toast.error("Players not found");
      return;
    }

    if (players.length < 5) {
      toast.error("Need at least 5 players to start the game");
      return;
    }

    if (room.rules.murderers + room.rules.angels + 1 > players.length + 1) {
      toast.error("Need at least 1 citizen");
      return;
    }

    const result = await startGame({
      room_id: room_id as Id<"rooms">,
    });

    if (!result) {
      toast.error("Failed to start the game");
      return;
    }

    toast.success("Game started");
  }

  if (!room || !players)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Players players={players} />
          <Rules room_id={room_id as Id<"rooms">} />
        </div>
        <Button onClick={startGameHandler} className="w-full">
          Start
        </Button>
      </div>
    </main>
  );
}
