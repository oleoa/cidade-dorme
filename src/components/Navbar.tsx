import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

import { SignInButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="flex justify-end items-center p-4 fixed top-0 left-0 right-0 h-16 bg-white">
      <SignedOut>
        <SignInButton>
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}
