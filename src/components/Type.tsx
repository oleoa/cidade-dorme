import { Separator } from "./ui/separator";

export default function Type({
  type,
  gameStatus,
}: {
  type: string;
  gameStatus: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 lg:w-fit w-full">
      <h2
        className={
          "text-2xl font-bold " +
          (type === "murderer" ? "text-red-400" : "") +
          (type === "angel" ? "text-yellow-400" : "") +
          (type === "narrator" ? "text-blue-400" : "") +
          (type === "spectator" ? "text-gray-400" : "") +
          (type === "citizen" ? "text-green-400" : "")
        }
      >
        You are{" "}
        {type === "murderer"
          ? "the murderer"
          : type === "angel"
            ? "the angel"
            : type === "narrator"
              ? "the narrator"
              : type === "citizen"
                ? "a citizen"
                : "a spectator"}
      </h2>
      <p>{gameStatus}</p>
      <Separator />
    </div>
  );
}
