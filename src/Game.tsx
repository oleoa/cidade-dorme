import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Navigate, useParams } from "react-router";
import Type from "./components/Type";
import Players from "./components/Players";
import { Button } from "./components/ui/button";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router";

export default function Game() {
  const navigate = useNavigate();

  const deleteGame = useMutation(api.rooms.deleteGame);
  const endGame = useMutation(api.rooms.endGame);
  // const leave = useMutation(api.players.leave);
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
      />
      <Players players={players} isNarrator={player.type === "narrator"} />
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
          <Button
            variant="destructive"
            className="w-fit"
            onClick={() => {
              deleteGame({ room_id: room_id as Id<"rooms"> });
              navigate("/");
            }}
          >
            Delete Game
          </Button>
        </div>
      )}
      {/* {player &&
        player.type != "narrator" &&
        player.type != "murderer" &&
        player.type != "angel" && (
          <Button
            variant="destructive"
            onClick={() => {
              leave({ player_id: player._id });
              navigate("/");
            }}
          >
            Leave
          </Button>
        )} */}
    </main>
  );
}
