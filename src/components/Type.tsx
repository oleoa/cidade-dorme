import { Separator } from "./ui/separator";

export default function Type({ type }: { type: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2
        className={
          "text-2xl font-bold " +
          (type === "murderer" ? "text-red-400" : "") +
          (type === "angel" ? "text-yellow-400" : "") +
          (type === "narrator" ? "text-blue-400" : "") +
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
                : ""}
      </h2>
      <Separator />
    </div>
  );
}
