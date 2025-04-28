import { Separator } from "./ui/separator";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Players({ players }: { players: any[] }) {
  return (
    <div className="flex flex-col gap-2 border-2 border-black py-2 px-4 rounded-lg">
      <h2 className="text-2xl font-bold">Players</h2>
      <Separator />
      {players?.map((player) => (
        <div key={player._id} className="flex rounded-lg">
          <h3>{player.name}</h3>
        </div>
      ))}
    </div>
  );
}
