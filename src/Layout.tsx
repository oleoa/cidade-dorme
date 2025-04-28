import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
      {children}
    </>
  );
}
