import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { InteractionsProvider } from "../contexts/InteractionsContext";
import { TasksProvider } from "../contexts/TasksContext";
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
    <html lang="en">
      <body>
        <ThemeProvider>
          <InteractionsProvider>
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
          </InteractionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
