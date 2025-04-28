/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function ManagePlayers({ players }: { players: any }) {
  const murderPlayer = useMutation(api.players.murder);
  const banPlayer = useMutation(api.players.ban);
  const revivePlayer = useMutation(api.players.revive);
  const alivePlayers = players?.filter((player: any) => player.alive);
  const deadPlayers = players?.filter((player: any) => !player.alive);

  const handleMurder = (playerId: string) => {
    murderPlayer({ player_id: playerId as Id<"players"> });
  };

  const handleRevive = (playerId: string) => {
    revivePlayer({ player_id: playerId as Id<"players"> });
  };

  const handleBan = (playerId: string) => {
    banPlayer({ player_id: playerId as Id<"players"> });
  };

  return (
    <div className="flex items-start justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-4 border-2 rounded-lg p-4 w-full">
        <h2 className="text-xl text-green-400 font-bold">Alive Players</h2>
        <Separator />
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          {alivePlayers?.map(
            (player: any) =>
              player.alive &&
              player.type !== "narrator" && (
                <div
                  key={player._id}
                  className="flex flex-row items-center justify-between gap-4 w-full"
                >
                  <p
                    className={
                      (player.type === "murderer" ? "text-red-400" : "") +
                      (player.type === "angel" ? "text-yellow-400" : "")
                    }
                  >
                    {player.name}
                  </p>
                  <div className="flex flex-row items-center justify-end gap-4 w-full">
                    <Button onClick={() => handleBan(player._id)}>Ban</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleMurder(player._id)}
                    >
                      Kill
                    </Button>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      {deadPlayers?.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-4 border-2 rounded-lg p-4 w-full">
          <h2 className="text-xl text-red-400 font-bold">Dead Players</h2>
          <Separator />
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            {deadPlayers?.map(
              (player: any) =>
                !player.alive &&
                player.type !== "narrator" && (
                  <div
                    key={player._id}
                    className="flex flex-row items-center justify-between gap-4 w-full"
                  >
                    <div
                      className={
                        "flex gap-2 " +
                        (player.type === "murderer" ? "text-red-400" : "") +
                        (player.type === "angel" ? "text-yellow-400" : "")
                      }
                    >
                      <span>
                        {player.death_reason == "murdered"
                          ? "Murdered: "
                          : "Banned: "}
                      </span>
                      <span>{player.name}</span>
                    </div>
                    <div className="flex flex-row items-center justify-end gap-4 w-full">
                      <Button
                        variant="outline"
                        onClick={() => handleRevive(player._id)}
                      >
                        Revive
                      </Button>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
