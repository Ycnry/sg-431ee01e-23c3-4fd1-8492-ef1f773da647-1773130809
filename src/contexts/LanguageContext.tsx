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
  "nav.messages": { en: "Messages", sw: "Ujumbe" },
  
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

  // Homepage Section Descriptions
  "sections.featured": { en: "Featured Providers", sw: "Watoaji Huduma Maarufu" },
  "sections.featuredDescription": { en: "Premium verified professionals across Tanzania", sw: "Wataalamu wastahilifu bora Tanzania nzima" },
  "sections.verified": { en: "Verified Technicians", sw: "Mafundi Wastahilifu" },
  "sections.verifiedDescription": { en: "Trusted fundis in your area", sw: "Mafundi waaminifu katika eneo lako" },
  "sections.shops": { en: "Hardware & Tool Suppliers", sw: "Wauzaji wa Vifaa na Zana" },
  "sections.shopsDescription": { en: "Quality materials and equipment providers", sw: "Watoaji wa vifaa na zana za ubora" },
  "sections.events": { en: "Trade Events & Workshops", sw: "Matukio ya Biashara na Warsha" },
  "sections.eventsDescription": { en: "Upcoming industry events and training", sw: "Matukio na mafunzo yanayokuja" },

  // Features Section - Specific Tanzania Content
  "features.verified.title": { en: "Best Fundis in Major Cities", sw: "Mafundi Bora Miji Mikubwa" },
  "features.verified.description": { en: "Connect with top-rated electricians, plumbers, and carpenters in Dar es Salaam, Arusha, Mwanza, and Dodoma", sw: "Unganisha na wafundi bora wa umeme, mabomba, na useremala Dar, Arusha, Mwanza, na Dodoma" },
  
  "features.messaging.title": { en: "Private & Secure Messaging", sw: "Ujumbe wa Faragha na Salama" },
  "features.messaging.description": { en: "Chat directly with fundis and shops without sharing your phone number. Safe communication guaranteed", sw: "Zungumza moja kwa moja na mafundi na maduka bila kushiriki namba yako ya simu. Mawasiliano salama yanahakikishwa" },
  
  "features.reviews.title": { en: "Quality Hardware Stores", sw: "Maduka ya Vifaa Bora" },
  "features.reviews.description": { en: "Find the best tool shops and building material suppliers in Dar es Salaam, Arusha, and across Tanzania", sw: "Pata maduka bora ya zana na vifaa vya ujenzi Dar es Salaam, Arusha, na Tanzania nzima" },
  
  "features.local.title": { en: "Biggest Trade Events in Tanzania", sw: "Matukio Makubwa Tanzania" },
  "features.local.description": { en: "Attend construction expos, tool fairs, and skills workshops happening in major cities across the country", sw: "Hudhuria maonyesho ya ujenzi, maonyesho ya zana, na warsha za ujuzi zinazofanyika miji mikubwa nchini" },
  
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
  
  // Auth
  "auth.signin.title": { en: "Sign In", sw: "Ingia" },
  "auth.signin.subtitle": { en: "Enter your credentials to access your account", sw: "Weka maelezo yako kuingia kwenye akaunti" },
  "auth.signin.button": { en: "Sign In", sw: "Ingia" },
  "auth.signin.link": { en: "Sign In", sw: "Ingia" },
  "auth.signup.title": { en: "Create Account", sw: "Fungua Akaunti" },
  "auth.signup.subtitle": { en: "Choose your account type and get started", sw: "Chagua aina ya akaunti na anza" },
  "auth.signup.button": { en: "Create Account", sw: "Fungua Akaunti" },
  "auth.signup.link": { en: "Sign Up", sw: "Jisajili" },
  "auth.email": { en: "Email", sw: "Barua pepe" },
  "auth.password": { en: "Password", sw: "Nenosiri" },
  "auth.confirmPassword": { en: "Confirm Password", sw: "Thibitisha Nenosiri" },
  "auth.name": { en: "Full Name", sw: "Jina Kamili" },
  "auth.phone": { en: "Phone Number", sw: "Namba ya Simu" },
  "auth.forgotPassword": { en: "Forgot password?", sw: "Umesahau nenosiri?" },
  "auth.noAccount": { en: "Don't have an account?", sw: "Hauna akaunti?" },
  "auth.hasAccount": { en: "Already have an account?", sw: "Una akaunti tayari?" },
  "auth.accountType": { en: "I am a", sw: "Mimi ni" },
  "auth.customer": { en: "Customer (looking for services)", sw: "Mteja (unatafuta huduma)" },
  "auth.fundi": { en: "Fundi (technician)", sw: "Fundi (mtaalamu)" },
  "auth.shop": { en: "Shop Owner", sw: "Mmiliki wa Duka" },
  
  // Messaging
  "messaging.inbox": { en: "Messages", sw: "Ujumbe" },
  "messaging.noMessages": { en: "No messages yet", sw: "Hakuna ujumbe bado" },
  "messaging.selectChat": { en: "Select a conversation to start messaging", sw: "Chagua mazungumzo kuanza kutuma ujumbe" },
  "messaging.typePlaceholder": { en: "Type a message...", sw: "Andika ujumbe..." },
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
