import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { MeetingsProvider } from "../contexts/MeetingsContext";
import { AlmaChatProvider } from "../contexts/AlmaChatContext";
import { FloatingAlmaChat } from "../components/FloatingAlmaChat";

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
            <AlmaChatProvider>
              {children}
              <FloatingAlmaChat />
            </AlmaChatProvider>
          </MeetingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
