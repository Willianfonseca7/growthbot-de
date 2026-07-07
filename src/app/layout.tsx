import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrowthBot DE",
  description: "LLM-powered sales assistant platform for Telegram and internal operations"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
