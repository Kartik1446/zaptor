import {SignedIn, SignedOut, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return <div>
    <SignedOut>
        <SignUpButton>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>

    <UserButton />
    <SignedIn>
        <div className="flex items-center space-x-4 mt-4">
          <UserButton />
          <SignOutButton>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </SignedIn>
  </div>;
}
