
import Head from "next/head";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function OfflinePage() {
  const { language } = useLanguage();

  return (
    <>
      <Head>
        <title>{language === "en" ? "Offline - Smart Fundi" : "Hakuna mtandao - Smart Fundi"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <WifiOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h1 className="text-2xl font-bold mb-2">
                  {language === "en" ? "You're Offline" : "Hakuna Mtandao"}
                </h1>
                <p className="text-muted-foreground mb-6">
                  {language === "en"
                    ? "Please check your internet connection and try again."
                    : "Tafadhali angalia muunganisho wako wa mtandao na ujaribu tena."}
                </p>
                <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                  {language === "en" ? "Retry" : "Jaribu Tena"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
