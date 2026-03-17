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
  
  // Bottom Navigation Tabs
  "nav.tab.home": { en: "Home", sw: "Nyumbani" },
  "nav.tab.search": { en: "Search", sw: "Tafuta" },
  "nav.tab.events": { en: "Events", sw: "Matukio" },
  "nav.tab.profile": { en: "Profile", sw: "Wasifu" },
  "nav.tab.login": { en: "Login", sw: "Ingia" },
  
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
  
  // Mixx by Yas (Tigo) Instructions
  "howToPay.mixx.title": { en: "Mixx by Yas", sw: "Mixx by Yas" },
  "howToPay.mixx.step1": { en: "Dial *150*01# from your Tigo phone", sw: "Bonyeza *150*01# kwenye simu yako ya Tigo" },
  "howToPay.mixx.step2": { en: "Enter your Mixx PIN", sw: "Ingiza PIN yako ya Mixx" },
  "howToPay.mixx.step3": { en: "Select \"Lipa Bili\" or \"Pay Bill\"", sw: "Chagua \"Lipa Bili\"" },
  "howToPay.mixx.step4": { en: "Enter Business PayBill Number (from shop/fundi)", sw: "Ingiza Nambari ya PayBill ya Biashara (kutoka kwa duka/fundi)" },
  "howToPay.mixx.step5": { en: "Enter Reference (e.g., \"Smart Fundi\" or invoice number)", sw: "Ingiza Kumbukumbu (mfano: \"Smart Fundi\" au nambari ya ankara)" },
  "howToPay.mixx.step6": { en: "Enter Amount (e.g., 5,000 TZS)", sw: "Ingiza Kiasi (mfano: 5,000 TZS)" },
  "howToPay.mixx.step7": { en: "Confirm with your PIN", sw: "Thibitisha kwa PIN yako" },
  "howToPay.mixx.step8": { en: "Complete! Save the confirmation SMS", sw: "Imekamilika! Hifadhi SMS ya uthibitisho" },
  "howToPay.mixx.example": { en: "Example PayBill: 400200", sw: "Mfano wa PayBill: 400200" },
  
  // Halotel Instructions
  "howToPay.halotel.title": { en: "Halotel", sw: "Halotel" },
  "howToPay.halotel.step1": { en: "Dial *150*88# from your Halotel phone", sw: "Bonyeza *150*88# kwenye simu yako ya Halotel" },
  "howToPay.halotel.step2": { en: "Enter your Halotel Money PIN", sw: "Ingiza PIN yako ya Halotel Money" },
  "howToPay.halotel.step3": { en: "Select \"Pay Bill\" or \"Lipa Bili\"", sw: "Chagua \"Lipa Bili\"" },
  "howToPay.halotel.step4": { en: "Enter Business Number (provided by shop/fundi)", sw: "Ingiza Nambari ya Biashara (iliyotolewa na duka/fundi)" },
  "howToPay.halotel.step5": { en: "Enter Reference (e.g., \"Smart Fundi\")", sw: "Ingiza Kumbukumbu (mfano: \"Smart Fundi\")" },
  "howToPay.halotel.step6": { en: "Enter Amount (e.g., 5,000 TZS)", sw: "Ingiza Kiasi (mfano: 5,000 TZS)" },
  "howToPay.halotel.step7": { en: "Confirm transaction with PIN", sw: "Thibitisha muamala kwa PIN" },
  "howToPay.halotel.step8": { en: "Done! Keep the confirmation message", sw: "Umeshasalia! Hifadhi ujumbe wa uthibitisho" },
  "howToPay.halotel.example": { en: "Example Business Number: 789000", sw: "Mfano wa Nambari ya Biashara: 789000" },
  
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
  
  // How to Pay - Bank SIM Banking Page
  "howToPayBank.title": { en: "How to Pay via Bank SIM Banking", sw: "Jinsi ya Kulipa kwa SIM Banking ya Benki" },
  "howToPayBank.subtitle": { en: "Pay using your bank's mobile banking service - no smartphone needed", sw: "Lipa kwa kutumia huduma ya benki ya simu - hakuna haja ya simu ya kisasa" },
  "howToPayBank.intro": { en: "Most Tanzanian banks offer USSD-based mobile banking that works on any phone. Choose your bank below and follow the simple steps.", sw: "Benki nyingi za Tanzania zinatoa huduma ya benki ya simu inayofanya kazi kwenye simu yoyote. Chagua benki yako hapa chini na fuata hatua rahisi." },
  
  // CRDB Bank - SimBanking
  "howToPayBank.crdb.title": { en: "CRDB Bank - SimBanking", sw: "CRDB Bank - SimBanking" },
  "howToPayBank.crdb.ussd": { en: "Dial: *150*03#", sw: "Piga: *150*03#" },
  "howToPayBank.crdb.step1": { en: "Dial *150*03# from your phone", sw: "Bonyeza *150*03# kwenye simu yako" },
  "howToPayBank.crdb.step2": { en: "Enter your SimBanking PIN", sw: "Ingiza Namba yako ya Siri ya SimBanking" },
  "howToPayBank.crdb.step3": { en: "Select: 2. Pay Bills", sw: "Chagua: 2. Lipa Bili" },
  "howToPayBank.crdb.step4": { en: "Select: 1. Pay to Business", sw: "Chagua: 1. Lipa kwa Biashara" },
  "howToPayBank.crdb.step5": { en: "Enter Business Number (provided by shop/fundi)", sw: "Ingiza Nambari ya Biashara (iliyotolewa na duka/fundi)" },
  "howToPayBank.crdb.step6": { en: "Enter Reference/Account (e.g., \"Smart Fundi\")", sw: "Ingiza Kumbukumbu/Akaunti (mfano: \"Smart Fundi\")" },
  "howToPayBank.crdb.step7": { en: "Enter Amount (e.g., 5,000 TZS)", sw: "Ingiza Kiasi (mfano: 5,000 TZS)" },
  "howToPayBank.crdb.step8": { en: "Confirm with your PIN", sw: "Thibitisha kwa PIN yako" },
  "howToPayBank.crdb.step9": { en: "Done! Save the confirmation SMS", sw: "Imekamilika! Hifadhi ujumbe wa uthibitisho" },
  
  // NMB Bank - Mkononi
  "howToPayBank.nmb.title": { en: "NMB Bank - Mkononi", sw: "NMB Bank - Mkononi" },
  "howToPayBank.nmb.ussd": { en: "Dial: *150*66#", sw: "Piga: *150*66#" },
  "howToPayBank.nmb.step1": { en: "Dial *150*66# or open NMB App", sw: "Bonyeza *150*66# au fungua NMB App" },
  "howToPayBank.nmb.step2": { en: "Enter your Mkononi PIN", sw: "Ingiza PIN yako ya Mkononi" },
  "howToPayBank.nmb.step3": { en: "Select: 4. Make Payments", sw: "Chagua: 4. Fanya Malipo" },
  "howToPayBank.nmb.step4": { en: "Select: 1. Pay to Business", sw: "Chagua: 1. Lipa kwa Biashara" },
  "howToPayBank.nmb.step5": { en: "Enter Business Number (from shop/fundi)", sw: "Ingiza Nambari ya Biashara (kutoka kwa duka/fundi)" },
  "howToPayBank.nmb.step6": { en: "Enter Reference Number", sw: "Ingiza Nambari ya Kumbukumbu" },
  "howToPayBank.nmb.step7": { en: "Enter Amount", sw: "Ingiza Kiasi" },
  "howToPayBank.nmb.step8": { en: "Confirm with your PIN", sw: "Thibitisha kwa PIN yako" },
  "howToPayBank.nmb.step9": { en: "Success! Save the confirmation SMS", sw: "Mafanikio! Hifadhi ujumbe wa uthibitisho" },
  
  // NBC - M-Benki
  "howToPayBank.nbc.title": { en: "NBC - M-Benki", sw: "NBC - M-Benki" },
  "howToPayBank.nbc.ussd": { en: "Dial: *150*55#", sw: "Piga: *150*55#" },
  "howToPayBank.nbc.step1": { en: "Dial *150*55# from your phone", sw: "Bonyeza *150*55# kwenye simu yako" },
  "howToPayBank.nbc.step2": { en: "Enter your M-Benki PIN", sw: "Ingiza PIN yako ya M-Benki" },
  "howToPayBank.nbc.step3": { en: "Select: 3. Payments", sw: "Chagua: 3. Malipo" },
  "howToPayBank.nbc.step4": { en: "Select: 2. Pay Bill", sw: "Chagua: 2. Lipa Bili" },
  "howToPayBank.nbc.step5": { en: "Enter Business Number", sw: "Ingiza Nambari ya Biashara" },
  "howToPayBank.nbc.step6": { en: "Enter Reference (e.g., \"Smart Fundi\")", sw: "Ingiza Kumbukumbu (mfano: \"Smart Fundi\")" },
  "howToPayBank.nbc.step7": { en: "Enter Amount", sw: "Ingiza Kiasi" },
  "howToPayBank.nbc.step8": { en: "Verify and confirm with PIN", sw: "Thibitisha kwa PIN" },
  "howToPayBank.nbc.step9": { en: "Complete! Keep confirmation message", sw: "Imekamilika! Hifadhi ujumbe wa uthibitisho" },
  
  // Azania Bank (Replaces TPB)
  "howToPayBank.azania.title": { en: "Azania Bank", sw: "Azania Bank" },
  "howToPayBank.azania.ussd": { en: "Dial: *150*75#", sw: "Piga: *150*75#" },
  "howToPayBank.azania.step1": { en: "Dial *150*75# from your phone", sw: "Bonyeza *150*75# kwenye simu yako" },
  "howToPayBank.azania.step2": { en: "Enter your Azania Mobile PIN", sw: "Ingiza PIN yako ya Azania Mobile" },
  "howToPayBank.azania.step3": { en: "Select: Pay Bills / Lipa Bili", sw: "Chagua: Lipa Bili" },
  "howToPayBank.azania.step4": { en: "Select: Pay Masterpass / QR", sw: "Chagua: Pay Masterpass / QR" },
  "howToPayBank.azania.step5": { en: "Enter Merchant/Business Number", sw: "Ingiza Namba ya Biashara" },
  "howToPayBank.azania.step6": { en: "Enter Reference (e.g., \"Smart Fundi\")", sw: "Ingiza Kumbukumbu (mfano: \"Smart Fundi\")" },
  "howToPayBank.azania.step7": { en: "Enter Amount", sw: "Ingiza Kiasi" },
  "howToPayBank.azania.step8": { en: "Confirm with your PIN", sw: "Thibitisha kwa PIN yako" },
  "howToPayBank.azania.step9": { en: "Payment successful! Save the SMS", sw: "Malipo yamefanikiwa! Hifadhi SMS" },
  
  // Bank Payment Tips
  "howToPayBank.tips.title": { en: "Important Banking Tips", sw: "Vidokezo Muhimu vya Benki" },
  "howToPayBank.tips.tip1": { en: "Works on any phone - no internet or smartphone required", sw: "Inafanya kazi kwenye simu yoyote - hakuna haja ya mtandao au simu ya kisasa" },
  "howToPayBank.tips.tip2": { en: "Always confirm the business name before entering PIN", sw: "Daima thibitisha jina la biashara kabla ya kuingiza PIN" },
  "howToPayBank.tips.tip3": { en: "Keep all confirmation messages for at least 3 months", sw: "Hifadhi ujumbe wote wa uthibitisho kwa angalau miezi 3" },
  "howToPayBank.tips.tip4": { en: "If payment fails, wait 5 minutes before trying again", sw: "Kama malipo yameshindwa, subiri dakika 5 kabla ya kujaribu tena" },
  "howToPayBank.tips.tip5": { en: "Contact your bank immediately if you see wrong transactions", sw: "Wasiliana na benki yako mara moja kama unaona muamala usio sahihi" },
  "howToPayBank.tips.tip6": { en: "Never share your banking PIN with anyone", sw: "Usimshirikishe mtu yeyote PIN yako ya benki" },
  
  // Bank Payment Common Terms
  "howToPayBank.common.businessNumber": { en: "Business Number", sw: "Nambari ya Biashara" },
  "howToPayBank.common.paybill": { en: "PayBill/Till Number", sw: "Nambari ya PayBill/Till" },
  "howToPayBank.common.reference": { en: "Reference/Account", sw: "Kumbukumbu/Akaunti" },
  "howToPayBank.common.amount": { en: "Amount", sw: "Kiasi" },
  "howToPayBank.common.pin": { en: "PIN", sw: "Namba ya Siri" },
  "howToPayBank.common.confirm": { en: "Confirm", sw: "Thibitisha" },
  "howToPayBank.common.sms": { en: "SMS Confirmation", sw: "Uthibitisho wa SMS" },
  "howToPayBank.common.example": { en: "Example", sw: "Mfano" },
  
  // Alternative Payment Methods Link
  "howToPayBank.alternatives.title": { en: "Other Payment Methods", sw: "Njia Nyingine za Malipo" },
  "howToPayBank.alternatives.description": { en: "Prefer mobile money? View M-Pesa, Airtel Money, and Mixx payment guides", sw: "Unapendelea pesa ya simu? Angalia miongozo ya M-Pesa, Airtel Money, na Mixx" },
  "howToPayBank.alternatives.link": { en: "Mobile Money Payment Guide", sw: "Mwongozo wa Malipo ya Pesa ya Simu" },
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
