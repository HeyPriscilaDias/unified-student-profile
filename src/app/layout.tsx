import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { InteractionsProvider } from "../contexts/InteractionsContext";
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
          <InteractionsProvider>
            <AlmaChatProvider>
              {children}
              <FloatingAlmaChat />
            </AlmaChatProvider>
          </InteractionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
