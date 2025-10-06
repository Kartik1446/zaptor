import {SignedIn, SignedOut, SignOutButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return <div>
    <SignedOut>
      <SignUpButton/>
    </SignedOut>

    <SignedIn>
      <SignOutButton/>
    </SignedIn>
  </div>;
}
