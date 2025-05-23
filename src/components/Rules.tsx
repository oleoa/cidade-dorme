import { Input } from "./ui/input";
import { Id } from "convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import Narrator from "./Narrator";

export default function Rules({ room_id }: { room_id: Id<"rooms"> }) {
  const updateRules = useMutation(api.rooms.updateRules);
  const room = useQuery(api.rooms.get, {
    room_id: room_id as Id<"rooms">,
  });

  const [murderers, setMurderers] = useState(room?.rules.murderers ?? 1);
  const [angels, setAngels] = useState(room?.rules.angels ?? 1);

  useEffect(() => {
    updateRules({
      room_id: room_id as Id<"rooms">,
      rules: {
        murderers,
        angels,
      },
    });
  }, [murderers, angels, room_id, updateRules]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-2">
        <Narrator room_id={room_id} />
        <div className="flex gap-2 items-center justify-between">
          <h3>Murderers</h3>
          <Input
            type="number"
            min={1}
            max={2}
            defaultValue={murderers}
            className="w-32"
            onChange={(e) => setMurderers(Number(e.target.value))}
          />
        </div>
        <div className="flex gap-2 items-center justify-between">
          <h3>Angels</h3>
          <Input
            type="number"
            min={0}
            max={1}
            defaultValue={angels}
            className="w-32"
            onChange={(e) => setAngels(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
