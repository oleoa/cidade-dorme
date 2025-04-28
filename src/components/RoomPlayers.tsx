import { Separator } from "./ui/separator";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RoomPlayers({ players }: { players: any[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-2 border-black py-2 px-4 rounded-lg">
      <div className="col-span-3">
        <h2 className="text-2xl font-bold">Players</h2>
        <Separator />
      </div>
      {players?.map((player) => (
        <div key={player._id} className="flex rounded-lg flex-col items-start">
          <h3>{player.name}</h3>
        </div>
      ))}
    </div>
  );
}
