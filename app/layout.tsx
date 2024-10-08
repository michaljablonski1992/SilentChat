import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ConvexClientProvider from '@/providers/ConvexClientProvider';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ThemeProvider } from '@/components/ui/theme/ThemeProvider';
import { Toaster } from "@/components/ui/sonner"

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const viewport: Viewport = {
  themeColor: "DodgerBlue",
};

export const metadata: Metadata = {
  title: 'SilentChat',
  description: 'Chat app for private conversations',
  generator: "Next.js",
  manifest: "/manifest.json",
  authors: [{ name: "5lab" }],
  icons: [
    { rel: "apple-touch-icon", url: "icon-192x192.png" },
    { rel: "icon", url: "icon-192x192.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // React will not warn you about mismatches in the attributes and the content of that element. 
    // It only works one level deep(so body element only), and is intended to be used as an escape hatch.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ConvexClientProvider>
        </ThemeProvider>
        <Toaster richColors closeButton/>
      </body>
    </html>
  );
}
