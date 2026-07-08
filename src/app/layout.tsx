import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { NoteProvider } from "@/providers/NoteProvider";
import { getUser } from "@/auth/server";
import { getAllNotes } from "@/actions/db";
import { Note } from "@prisma/client";


export const metadata: Metadata = {
  title: "W❤️W Note",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getUser();
  const serverNotes = user ? await getAllNotes(user?.id || "") as Note[] : [];
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NoteProvider initialNotes={serverNotes}>
            <SidebarProvider>
              <AppSidebar />
              <div className="flex min-h-screen w-full flex-col">
                <Header />
                <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">{children}</main>
              </div>
            </SidebarProvider>
          </NoteProvider>

          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html >
  );
}
