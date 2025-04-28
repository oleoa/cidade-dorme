import { Separator } from "./ui/separator";

export default function Card({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-xl flex flex-col gap-2 w-full">
      <h2 className="text-2xl font-bold whitespace-nowrap">{title}</h2>
      <Separator />
      {children}
    </div>
  );
}
