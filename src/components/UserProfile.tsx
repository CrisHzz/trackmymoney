// import { useUser } from "@clerk/nextjs";
// import UserButton from "./UserButton";

export default function UserProfile() {
  // const { isLoaded, user } = useUser();

  // if (!isLoaded || !user) {
  //   return <div className="animate-pulse h-6 w-32 bg-gray-200/20 rounded"></div>; // Placeholder más pequeño
  // }

  // Modo desarrollo sin autenticación
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium text-white">
          ¡Hola, Usuario de Prueba!
        </h2>
        <p className="text-xs text-white/80">
          Panel de control de finanzas
        </p>
      </div>
      {/* <UserButton /> */}
    </div>
  );
}
