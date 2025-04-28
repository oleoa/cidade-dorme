import { Button } from "./components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useNavigate } from "react-router";

export default function App() {
  const createRoom = useMutation(api.rooms.create);
  const navigate = useNavigate();

  async function handleCreateRoom() {
    const newRoomId = await createRoom();
    navigate(`/room/${newRoomId}`);
  }

  return (
    <main className="flex flex-col gap-4 items-center justify-center h-full">
      <h1 className="text-4xl font-bold">Cidade Dorme</h1>
      <div>
        <Button onClick={handleCreateRoom}>Create a new room</Button>
      </div>
    </main>
  );
}
