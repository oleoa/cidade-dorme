import { Link, Navigate, useNavigate, useParams } from "react-router";

import { useMutation, useQuery } from "convex/react";

import { Id } from "convex/_generated/dataModel";
import { api } from "../convex/_generated/api";

import { Button } from "./components/ui/button";
import Card from "./components/Card";
import { toast } from "sonner";

import Rules from "./components/Rules";
import DeleteRoom from "./components/DeleteRoom";

export default function Room() {
  const navigate = useNavigate();
  const populatePlayers = useMutation(api.players.createFaleExamples);

  const { room_id } = useParams();
  const room_id_arg = room_id as Id<"rooms">;
  const room = useQuery(api.rooms.get, {
    room_id: room_id_arg,
  });

  const startGame = useMutation(api.rooms.start);

  const createPlayer = useMutation(api.players.create);
  createPlayer({
    room_id: room_id_arg,
  });

  const players = useQuery(api.rooms.getPlayers, {
    room_id: room_id_arg,
  });

  async function startGameHandler() {
    if (!room) return toast.error("Room not found");
    if (room.playing) return toast.error("Game already started");
    if (!players) return toast.error("Players not found");
    if (players.length < 5)
      return toast.error("Need at least 5 players to start the game");
    if (room.rules.murderers + room.rules.angels + 1 > players.length + 1)
      return toast.error("Need at least 1 citizen");

    const result = await startGame({
      room_id: room_id_arg,
    });

    if (!result) return toast.error("Failed to start the game");

    toast.success("Game started");
    navigate(`/game/${room_id}`);
  }

  function shareRoom() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Room URL copied to clipboard");
  }

  if (room === undefined || players === undefined) {
    return (
      <main className="flex items-center justify-center h-full">
        Loading...
      </main>
    );
  }

  if (room === null || players === null) {
    return (
      <main className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <Link to="/">Go to home</Link>
      </main>
    );
  }

  if (room.status == "Playing") {
    return <Navigate to={`/game/${room_id}`} replace />;
  }

  return (
    <main className="flex lg:items-center items-start justify-center pt-16 h-full">
      <div className="flex flex-col gap-4">
        <Card title="Players">
          <div className="grid grid-cols-3 gap-4">
            {players?.map((player) => (
              <div
                key={player._id}
                className="flex rounded-lg flex-col items-start"
              >
                <h3
                  className={player.type == "narrator" ? "text-blue-400" : ""}
                >
                  {player.name}
                </h3>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Rules">
          <Rules room_id={room_id_arg} />
        </Card>
        <Button onClick={() => populatePlayers({ room_id: room_id_arg })}>
          Populate
        </Button>
        <Button onClick={startGameHandler}>Start</Button>
        <Button variant="outline" onClick={shareRoom}>
          Share
        </Button>
        <DeleteRoom room_id={room_id_arg} />
      </div>
    </main>
  );
}
