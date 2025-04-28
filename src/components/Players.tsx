/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import Card from "./Card";

interface Props {
  players: any;
  isNarrator: boolean;
}

export default function Players({ players, isNarrator }: Props) {
  const murderPlayer = useMutation(api.players.murder);
  const banPlayer = useMutation(api.players.ban);
  const revivePlayer = useMutation(api.players.revive);

  const alivePlayers = players?.filter((player: any) => player.alive);
  const deadPlayers = players?.filter((player: any) => !player.alive);

  const handleMurder = async (playerId: string) => {
    const { success, message } = await murderPlayer({
      player_id: playerId as Id<"players">,
    });
    if (!success) toast.error(message);
    else toast.success(message);
  };

  const handleRevive = async (playerId: string) => {
    const { success, message } = await revivePlayer({
      player_id: playerId as Id<"players">,
    });
    if (!success) toast.error(message);
    else toast.success(message);
  };

  const handleBan = async (playerId: string) => {
    const { success, message } = await banPlayer({
      player_id: playerId as Id<"players">,
    });
    if (!success) toast.error(message);
    else toast.success(message);
  };

  return (
    <div className="flex lg:flex-row flex-col lg:items-start items-center justify-center gap-4 lg:w-fit w-full">
      {alivePlayers?.length > 0 && (
        <Card title="Alive Players">
          <div className="flex flex-col items-center justify-center gap-4 pt-2">
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
                        (isNarrator && player.type === "murderer"
                          ? "text-red-400"
                          : "") +
                        (isNarrator && player.type === "angel"
                          ? "text-yellow-400"
                          : "")
                      }
                    >
                      {player.name}
                    </p>
                    {isNarrator && (
                      <div className="flex gap-4">
                        <Button onClick={() => handleBan(player._id)}>
                          Ban
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleMurder(player._id)}
                        >
                          Kill
                        </Button>
                      </div>
                    )}
                  </div>
                )
            )}
          </div>
        </Card>
      )}
      {deadPlayers?.length > 0 && (
        <Card title="Dead Players">
          <div className="flex flex-col items-center justify-center gap-4 pt-2">
            {deadPlayers?.map(
              (player: any) =>
                !player.alive &&
                player.type !== "narrator" && (
                  <div
                    key={player._id}
                    className="flex flex-row items-center justify-between gap-4 w-full"
                  >
                    <p
                      className={
                        (isNarrator && player.type === "murderer"
                          ? "text-red-400"
                          : "") +
                        (isNarrator && player.type === "angel"
                          ? "text-yellow-400"
                          : "")
                      }
                    >
                      {player.name}
                    </p>
                    {isNarrator && (
                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          onClick={() => handleRevive(player._id)}
                        >
                          Revive
                        </Button>
                      </div>
                    )}
                  </div>
                )
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
