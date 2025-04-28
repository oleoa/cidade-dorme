import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";

export default function Narrator({ room_id }: { room_id: Id<"rooms"> }) {
  const players = useQuery(api.players.getPlayers, {
    room_id: room_id as Id<"rooms">,
  });

  const setNarrator = useMutation(api.players.setNarrator);
  const unsetNarrator = useMutation(api.players.unsetNarrator);

  const narrator = players?.find((player) => player.type === "narrator");

  async function setNarratorHandler(narrator: string) {
    const name = await setNarrator({
      narrator: narrator as Id<"players">,
    });
    toast.success(name + " is now the narrator");
  }

  return (
    <div className="flex gap-2 items-center justify-between">
      <h3 className="text-start">Narrator</h3>
      <div className="flex gap-1 items-center justify-center">
        {narrator && (
          <button
            onClick={() => unsetNarrator({ room_id: room_id as Id<"rooms"> })}
            className="p-2 cursor-pointer"
          >
            <i className="fa-solid fa-shuffle"></i>
          </button>
        )}
        <Select onValueChange={setNarratorHandler} value={narrator?._id ?? ""}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Random" />
          </SelectTrigger>
          <SelectContent>
            {players?.map((player) => (
              <SelectItem key={player._id} value={player._id}>
                {player.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
