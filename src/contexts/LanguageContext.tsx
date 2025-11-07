
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "sw";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.home": { en: "Home", sw: "Nyumbani" },
  "nav.fundis": { en: "Find Fundis", sw: "Tafuta Fundi" },
  "nav.shops": { en: "Shops", sw: "Maduka" },
  "nav.events": { en: "Events", sw: "Matukio" },
  "nav.signin": { en: "Sign In", sw: "Ingia" },
  "nav.signup": { en: "Sign Up", sw: "Jisajili" },
  
  // Splash & Welcome
  "splash.tagline": { en: "Connecting You to Skilled Technicians", sw: "Kukuunganisha na Mafundi Hodari" },
  "welcome.title": { en: "Welcome", sw: "Karibu" },
  "welcome.subtitle": { en: "Find trusted technicians and shops near you", sw: "Pata mafundi na maduka unayowaamini karibu nawe" },
  
  // Homepage Sections
  "home.hero.title": { en: "Find Skilled Technicians Near You", sw: "Pata Mafundi Hodari Karibu Nawe" },
  "home.hero.subtitle": { en: "Connect with verified fundis and quality hardware shops across Tanzania", sw: "Unganisha na mafundi wastahilifu na maduka ya ubora Tanzania nzima" },
  "home.hero.search": { en: "Search for fundis or shops...", sw: "Tafuta fundi au duka..." },
  "home.hero.findFundi": { en: "Find a Fundi", sw: "Tafuta Fundi" },
  
  "home.featured.title": { en: "Featured Fundis & Shops", sw: "Mafundi na Maduka Maarufu" },
  "home.verified.title": { en: "Verified Technicians", sw: "Mafundi Wastahilifu" },
  "home.shops.title": { en: "Fundi Supply Stores", sw: "Maduka ya Vifaa" },
  "home.events.title": { en: "Upcoming Trade Events", sw: "Matukio Yanayokuja" },
  
  // Profile Actions
  "action.message": { en: "Message", sw: "Tuma Ujumbe" },
  "action.call": { en: "Call", sw: "Piga Simu" },
  "action.whatsapp": { en: "WhatsApp", sw: "WhatsApp" },
  "action.viewProfile": { en: "View Profile", sw: "Angalia Wasifu" },
  
  // Common
  "common.rating": { en: "Rating", sw: "Ukadiriaji" },
  "common.reviews": { en: "reviews", sw: "maoni" },
  "common.verified": { en: "Verified", sw: "Wastahilifu" },
  "common.city": { en: "City", sw: "Jiji" },
  "common.specialty": { en: "Specialty", sw: "Utaalamu" },
  "common.loadMore": { en: "Load More", sw: "Pakia Zaidi" },
  
  // Cities
  "city.dar": { en: "Dar es Salaam", sw: "Dar es Salaam" },
  "city.arusha": { en: "Arusha", sw: "Arusha" },
  "city.mwanza": { en: "Mwanza", sw: "Mwanza" },
  "city.dodoma": { en: "Dodoma", sw: "Dodoma" },
  
  // Specialties
  "specialty.plumber": { en: "Plumber", sw: "Fundi Bomba" },
  "specialty.electrician": { en: "Electrician", sw: "Fundi Umeme" },
  "specialty.carpenter": { en: "Carpenter", sw: "Seremala" },
  "specialty.mechanic": { en: "Mechanic", sw: "Fundi Gari" },
  "specialty.welder": { en: "Welder", sw: "Mwuweledi" },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("smartfundi_language") as Language;
    if (saved && (saved === "en" || saved === "sw")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("smartfundi_language", lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
