// import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Registrarse | Track My Money",
  description: "Crea una cuenta en Track My Money para gestionar tus finanzas",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#F40752] to-[#F9AB8F]">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Modo Desarrollo</h1>
          <p className="text-sm text-gray-600">La autenticación está deshabilitada para pruebas</p>
        </div>
        <div className="space-y-4">
          <Link 
            href="/pages/dashboard"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg block text-center transition-colors"
          >
            Acceder al Dashboard
          </Link>
          <Link 
            href="/"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg block text-center transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
