import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { InteractionsProvider } from "../contexts/InteractionsContext";
import { TasksProvider } from "../contexts/TasksContext";
import { AlmaChatProvider } from "../contexts/AlmaChatContext";
import { ActiveMeetingProvider } from "../contexts/ActiveMeetingContext";

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
            <TasksProvider>
              <ActiveMeetingProvider>
                <AlmaChatProvider>
                  {children}
                </AlmaChatProvider>
              </ActiveMeetingProvider>
            </TasksProvider>
          </InteractionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
