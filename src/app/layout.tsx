import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { InteractionsProvider } from "../contexts/InteractionsContext";
import { TasksProvider } from "../contexts/TasksContext";
import { SmartGoalsProvider } from "../contexts/SmartGoalsContext";
import { NotesProvider } from "../contexts/NotesContext";
import { AlmaChatProvider } from "../contexts/AlmaChatContext";
import { ActiveMeetingProvider } from "../contexts/ActiveMeetingContext";
import { TranscriptionBannerWrapper, ContentWrapper } from "../components/TranscriptionBanner";

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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <InteractionsProvider>
            <SmartGoalsProvider>
              <TasksProvider>
                <NotesProvider>
                  <ActiveMeetingProvider>
                    <AlmaChatProvider>
                    <ContentWrapper>
                      {children}
                    </ContentWrapper>
                    <TranscriptionBannerWrapper />
                  </AlmaChatProvider>
                  </ActiveMeetingProvider>
                </NotesProvider>
              </TasksProvider>
            </SmartGoalsProvider>
          </InteractionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
