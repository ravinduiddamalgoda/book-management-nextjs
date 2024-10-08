import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import client from "@/src/config/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "@/src/context/AuthContext";

const poppins = Poppins({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: "Books",
  description: "Books by Ravindu Iddamalgoda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <AuthProvider>
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
    </AuthProvider>
  );
}