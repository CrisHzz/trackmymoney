// import { UserButton as ClerkUserButton } from "@clerk/nextjs";

export default function UserButton() {
  // Modo desarrollo - botón placeholder
  return (
    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
      <span className="text-sm font-medium">U</span>
    </div>
  );
  
  // return (
  //   <ClerkUserButton
  //     appearance={{
  //       elements: {
  //         userButtonAvatarBox: "w-10 h-10",
  //         userButtonPopoverCard: "bg-white shadow-lg rounded-lg border border-gray-200",
  //       },
  //     }}
  //     afterSignOutUrl="/"
  //   />
  // );
}
