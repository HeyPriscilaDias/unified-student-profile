import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { MeetingsProvider } from "../contexts/MeetingsContext";

export const metadata: Metadata = {
  title: "Unified Student Profile",
  description: "Willow prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <MeetingsProvider>
            {children}
          </MeetingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
