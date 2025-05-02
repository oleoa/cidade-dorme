import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Navigate, useParams } from "react-router";
import Type from "./components/Type";
import Players from "./components/Players";
import { Button } from "./components/ui/button";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router";
import DeleteRoom from "./components/DeleteRoom";

export default function Game() {
  const navigate = useNavigate();

  const endGame = useMutation(api.rooms.endGame);

  const newGame = useMutation(api.rooms.newGame);

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

  if (room === null || player === null) {
    return (
      <main className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <Button onClick={() => navigate("/")}>Go to home</Button>
      </main>
    );
  }

  if (!player) {
    return (
      <main className="flex items-center justify-center h-screen">
        Loading...
      </main>
    );
  }

  if (room.status == "Waiting") {
    return <Navigate to={`/room/${room_id}`} replace />;
  }

  return (
    <main className="flex flex-col items-center justify-start h-screen pt-16 gap-4 px-8">
      <Type
        type={player ? player.type : "spectator"}
        gameStatus={room.status}
        onlyOneMurderer={room.rules.murderers === 1}
      />
      <Players
        players={players}
        isNarrator={player.type === "narrator"}
        isAMurderer={player.type === "murderer"}
      />
      {player.type == "narrator" && (
        <div className="flex flex-row gap-4 pb-4">
          {room.status == "Playing" && (
            <Button
              variant="destructive_outline"
              className="w-fit"
              onClick={() => {
                endGame({ room_id: room_id as Id<"rooms"> });
              }}
            >
              End Game
            </Button>
          )}
          {room.status == "Ended" && (
            <Button
              className="w-fit"
              onClick={() => {
                newGame({ room_id: room_id as Id<"rooms"> });
              }}
            >
              New Game
            </Button>
          )}
          <DeleteRoom room_id={room_id as Id<"rooms">} />
        </div>
      )}
    </main>
  );
}
