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
  "nav.howToPay": { en: "How to Pay", sw: "Jinsi ya Kulipa" },
  
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

  // How to Pay Page
  "howToPay.title": { en: "How to Pay a Fundi or Shop", sw: "Jinsi ya Kulipa Fundi au Duka" },
  "howToPay.subtitle": { en: "Choose your mobile money provider and follow the simple steps", sw: "Chagua mtoa huduma wako wa pesa na fuata hatua rahisi" },
  "howToPay.needHelp": { en: "Need Help?", sw: "Unahitaji Msaada?" },
  "howToPay.contactSupport": { en: "Contact our support team", sw: "Wasiliana na timu yetu ya msaada" },
  
  // M-Pesa Instructions
  "howToPay.mpesa.title": { en: "Vodacom M-Pesa", sw: "Vodacom M-Pesa" },
  "howToPay.mpesa.step1": { en: "Open your M-Pesa app or dial *150#", sw: "Fungua M-Pesa yako au kama haiko, bonyeza *150#" },
  "howToPay.mpesa.step2": { en: "Select \"Lipa Na M-Pesa\"", sw: "Chagua \"Lipa Na M-Pesa\"" },
  "howToPay.mpesa.step3": { en: "Select \"Lipa Kwa Simu\"", sw: "Chagua \"Lipa Kwa Simu\"" },
  "howToPay.mpesa.step4": { en: "Enter Business Number (Lipa Number provided by shop/fundi)", sw: "Ingiza Nambari ya Biashara (Lipa Number iliyotolewa na duka/fundi)" },
  "howToPay.mpesa.step5": { en: "Enter Account/Reference (Optional - e.g., \"Smart Fundi\")", sw: "Ingiza Kumbukumbu (Opsional - mfano: \"Smart Fundi\")" },
  "howToPay.mpesa.step6": { en: "Enter Amount (e.g., 5,000 TZS)", sw: "Ingiza Kiasi (mfano: 5,000 TZS)" },
  "howToPay.mpesa.step7": { en: "Enter your M-Pesa PIN to confirm", sw: "Ingiza Namba yako ya Siri ya M-Pesa kuthibitisha" },
  "howToPay.mpesa.step8": { en: "Done! Send the confirmation SMS screenshot as proof", sw: "Umeshasalia! Tuma picha ya SMS ya uthibitisho kama ushahidi" },
  "howToPay.mpesa.example": { en: "Example Business Number: 400200", sw: "Mfano wa Nambari ya Biashara: 400200" },
  
  // Airtel Money Instructions
  "howToPay.airtel.title": { en: "Airtel Money", sw: "Airtel Money" },
  "howToPay.airtel.step1": { en: "Open Airtel Money app or dial *150*60#", sw: "Fungua Airtel Money au bonyeza *150*60#" },
  "howToPay.airtel.step2": { en: "Select \"Make Payment\"", sw: "Chagua \"Fanya Malipo\"" },
  "howToPay.airtel.step3": { en: "Select \"Lipa Number\"", sw: "Chagua \"Lipa Number\"" },
  "howToPay.airtel.step4": { en: "Enter the Lipa Number (provided by shop/fundi)", sw: "Ingiza Lipa Number (iliyotolewa na duka/fundi)" },
  "howToPay.airtel.step5": { en: "Enter Account Number (Optional - e.g., your name or \"Smart Fundi\")", sw: "Ingiza Nambari ya Akaunti (Opsional - mfano: jina lako au \"Smart Fundi\")" },
  "howToPay.airtel.step6": { en: "Enter Amount (e.g., 5,000 TZS)", sw: "Ingiza Kiasi (mfano: 5,000 TZS)" },
  "howToPay.airtel.step7": { en: "Enter your Airtel Money PIN", sw: "Ingiza PIN yako ya Airtel Money" },
  "howToPay.airtel.step8": { en: "Success! Save the confirmation message as proof", sw: "Mafanikio! Hifadhi ujumbe wa uthibitisho kama ushahidi" },
  "howToPay.airtel.example": { en: "Example Lipa Number: 123456", sw: "Mfano wa Lipa Number: 123456" },
  
  // Mixx by Yas Instructions
  "howToPay.mixx.title": { en: "Mixx by Yas (Halotel)", sw: "Mixx by Yas (Halotel)" },
  "howToPay.mixx.step1": { en: "Open Mixx by Yas app or dial *150*88#", sw: "Fungua Mixx by Yas au bonyeza *150*88#" },
  "howToPay.mixx.step2": { en: "Select \"Send Money\"", sw: "Chagua \"Tuma Pesa\"" },
  "howToPay.mixx.step3": { en: "Select \"Pay Bill\"", sw: "Chagua \"Lipa Bili\"" },
  "howToPay.mixx.step4": { en: "Enter Business Number (Lipa Number from shop/fundi)", sw: "Ingiza Nambari ya Biashara (Lipa Number kutoka kwa duka/fundi)" },
  "howToPay.mixx.step5": { en: "Enter Reference (Optional - e.g., \"Smart Fundi\" or your name)", sw: "Ingiza Rejea (Opsional - mfano: \"Smart Fundi\" au jina lako)" },
  "howToPay.mixx.step6": { en: "Enter Amount (e.g., 5,000 TZS)", sw: "Ingiza Kiasi (mfano: 5,000 TZS)" },
  "howToPay.mixx.step7": { en: "Enter your Mixx PIN to confirm", sw: "Ingiza PIN yako ya Mixx kuthibitisha" },
  "howToPay.mixx.step8": { en: "Complete! Keep the confirmation SMS as proof of payment", sw: "Imekamilika! Hifadhi SMS ya uthibitisho kama ushahidi wa malipo" },
  "howToPay.mixx.example": { en: "Example Business Number: 789000", sw: "Mfano wa Nambari ya Biashara: 789000" },
  
  // Payment Tips
  "howToPay.tips.title": { en: "Payment Tips", sw: "Vidokezo vya Malipo" },
  "howToPay.tips.tip1": { en: "Always ask for the Lipa Number before making payment", sw: "Daima uliza Lipa Number kabla ya kulipa" },
  "howToPay.tips.tip2": { en: "Save confirmation messages for at least 30 days", sw: "Hifadhi ujumbe wa uthibitisho kwa angalau siku 30" },
  "howToPay.tips.tip3": { en: "Verify the business name matches before confirming", sw: "Thibitisha jina la biashara linafanana kabla ya kuthibitisha" },
  "howToPay.tips.tip4": { en: "Never share your PIN with anyone", sw: "Usimshirikishe mtu yeyote PIN yako" },
  "howToPay.tips.tip5": { en: "Contact support if payment fails", sw: "Wasiliana na msaada kama malipo yameshindwa" },
  
  // Common Terms
  "howToPay.common.businessNumber": { en: "Business Number", sw: "Nambari ya Biashara" },
  "howToPay.common.lipaNumber": { en: "Lipa Number", sw: "Lipa Number" },
  "howToPay.common.amount": { en: "Amount", sw: "Kiasi" },
  "howToPay.common.reference": { en: "Reference/Account", sw: "Rejea/Akaunti" },
  "howToPay.common.pin": { en: "PIN", sw: "Namba ya Siri" },
  "howToPay.common.confirm": { en: "Confirm", sw: "Thibitisha" },
  "howToPay.common.success": { en: "Success", sw: "Mafanikio" },
  "howToPay.common.step": { en: "Step", sw: "Hatua" },
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
