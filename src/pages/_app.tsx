import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { initializeMockSubscriptions, initializeSampleMediaMessages } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { LiveChatWidget } from "@/components/LiveChatWidget";

export default function App({ Component, pageProps }: AppProps) {
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    initializeMockSubscriptions();
    initializeSampleMediaMessages();

    // Wait for splash screen (3s) + welcome animation (2s) to complete
    const timer = setTimeout(() => {
      setSplashComplete(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Component {...pageProps} />
          <BottomNavigation visible={splashComplete} />
          <LiveChatWidget />
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
