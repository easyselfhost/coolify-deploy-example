import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanban Board Todo App",
  description: "A simple Kanban board app built with Next.js, React, and Drizzle ORM. Organize your tasks with drag-and-drop, todo lists, and more.",
  keywords: [
    "Kanban",
    "Todo App",
    "Task Management",
    "Next.js",
    "React",
    "Drizzle ORM",
    "SQLite",
    "Productivity"
  ],
  authors: [{ name: "Your Name or Team" }],
  openGraph: {
    title: "Kanban Board Todo App",
    description: "A simple Kanban board app built with Next.js, React, and Drizzle ORM. Organize your tasks with drag-and-drop, todo lists, and more.",
    url: "https://your-app-url.com/",
    siteName: "Kanban Board Todo App",
    images: [
      {
        url: "https://your-app-url.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kanban Board Todo App Preview"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Kanban Board Todo App",
    description: "A simple Kanban board app built with Next.js, React, and Drizzle ORM. Organize your tasks with drag-and-drop, todo lists, and more.",
    images: ["https://your-app-url.com/og-image.png"]
  },
  metadataBase: new URL("https://your-app-url.com/")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
