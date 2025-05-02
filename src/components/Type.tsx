import { Separator } from "./ui/separator";

interface Props {
  type: string;
  gameStatus: string;
  onlyOneMurderer: boolean;
}

export default function Type({ type, gameStatus, onlyOneMurderer }: Props) {
  let playerIs = "";
  if (type === "murderer") {
    if (onlyOneMurderer) playerIs = "You are the murderer";
    else playerIs = "You are a murderer";
  } else if (type === "angel") {
    playerIs = "You are the angel";
  } else if (type === "narrator") {
    playerIs = "You are the narrator";
  } else if (type === "citizen") {
    playerIs = "You are a citizen";
  } else if (type === "spectator") {
    playerIs = "You are a spectator";
  }

  let playerColor = "";
  if (type === "murderer") playerColor = "text-red-400";
  else if (type === "angel") playerColor = "text-yellow-400";
  else if (type === "narrator") playerColor = "text-blue-400";
  else if (type === "citizen") playerColor = "text-green-400";
  else if (type === "spectator") playerColor = "text-gray-400";

  return (
    <div className="flex flex-col items-center justify-center gap-2 lg:w-fit w-full">
      <h2 className={"text-2xl font-bold " + playerColor}>{playerIs}</h2>
      <p>{gameStatus}</p>
      <Separator />
    </div>
  );
}
