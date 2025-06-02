import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import HeaderClient from "../components/HeaderClient";
import { Toaster } from 'react-hot-toast';
import { PWATestControls } from "../components/PWATestControls";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <head>
          <title>Track My Money</title>
          <meta
            name="description"
            content="Gestiona tus finanzas efectivamente con Track My Money."
          />
        </head>
        <body>
          <HeaderClient />
          <main>
            {children}
          </main>
          <Toaster position="top-right" />
          <PWATestControls />
        </body>
      </html>
    </ClerkProvider>
  );
}
