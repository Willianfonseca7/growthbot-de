import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowthBot DE",
  description: "Recruiter-safe live surface for the GrowthBot DE AI sales platform"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
