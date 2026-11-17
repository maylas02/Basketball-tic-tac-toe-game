import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hoops Tic-Tac-Toe",
  description:
    "A basketball-themed, two-player tic-tac-toe game with a scoreboard. Play the Ball against the Hoop.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
