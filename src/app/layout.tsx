import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Nossa Casa Nova - Lista de Presentes",
  description: "Ajude-nos a mobiliar nossa casa nova com sua contribuição!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script src="https://sdk.mercadopago.com/js/v2" async></script>
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
