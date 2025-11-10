
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { initializeMockSubscriptions } from "@/lib/mockData";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initializeMockSubscriptions();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
