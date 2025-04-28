import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "react-router";
import Type from "./components/Type";
import GamePlayers from "./components/GamePlayers";
import ManagePlayers from "./components/ManagePlayers";
import { Button } from "./components/ui/button";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router";

export default function Game() {
  const navigate = useNavigate();

  const terminate = useMutation(api.rooms.terminate);

  const { room_id } = useParams();
  const room = useQuery(api.rooms.get, {
    room_id: room_id as Id<"rooms">,
  });

  const players = useQuery(api.players.getPlayers, {
    room_id: room_id as Id<"rooms">,
  });

  const player = useQuery(api.players.getMyself, {
    room_id: room_id as Id<"rooms">,
  });

  if (room === undefined || player === undefined) {
    return (
      <main className="flex items-center justify-center h-screen">
        Loading...
      </main>
    );
  }

  if (room === null || !player) {
    return (
      <main className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <Button onClick={() => navigate("/")}>Go to home</Button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start h-screen pt-16 gap-4">
      <Type type={player.type} />
      {player.type == "narrator" ? (
        <ManagePlayers players={players} />
      ) : (
        <GamePlayers players={players} />
      )}
      {player.type == "narrator" && (
        <Button
          variant="destructive"
          onClick={() => {
            terminate({ room_id: room_id as Id<"rooms"> });
            navigate("/");
          }}
        >
          Terminate
        </Button>
      )}
    </main>
  );
}
