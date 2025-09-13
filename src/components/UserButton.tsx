import { UserButton as ClerkUserButton } from "@clerk/nextjs";

export default function UserButton() {
  return (
    <ClerkUserButton
      appearance={{
        elements: {
          userButtonAvatarBox: "w-10 h-10",
          userButtonPopoverCard: "bg-white shadow-lg rounded-lg border border-gray-200",
        },
      }}
      redirectUrl="/"
    />
  );
}
