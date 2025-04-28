/* eslint-disable @typescript-eslint/no-explicit-any */
import { Separator } from "./ui/separator";

export default function AlivePlayers({ players }: { players: any }) {
  const alivePlayers = players.filter((player: any) => player.alive);
  const deadPlayers = players.filter((player: any) => !player.alive);

  return (
    <div className="flex lg:flex-row flex-col lg:items-center items-start justify-center gap-4 w-full">
      {alivePlayers.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-4 border-2 rounded-lg p-4 lg:w-fit w-full">
          <h2 className="text-xl text-green-400 font-bold">Alive Players</h2>
          <Separator />
          <div className="flex flex-col items-center justify-center gap-4">
            {alivePlayers?.map((player: any) => (
              <div key={player._id}>{player.name}</div>
            ))}
          </div>
        </div>
      )}
      {deadPlayers.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-4 border-2 rounded-lg p-4 lg:w-fit w-full">
          <h2 className="text-xl text-red-400 font-bold">Dead Players</h2>
          <Separator />
          <div className="flex flex-col items-center justify-center gap-4">
            {deadPlayers?.map((player: any) => (
              <div key={player._id}>{player.name}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
