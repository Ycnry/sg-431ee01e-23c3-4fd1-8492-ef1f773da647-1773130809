
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageSquare, Phone, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function HelpSupport() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showCallButton, setShowCallButton] = useState(false);
  const [supportHotline, setSupportHotline] = useState("+255759218354");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const settings = localStorage.getItem("support_settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      setSupportHotline(parsed.hotline_number || "+255759218354");
    }

    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: language === "en"
        ? "Hello! I'm Smart Fundi's AI assistant. I can help you with registration, payments, messaging, and more. How can I help you today?"
        : "Habari! Mimi ni msaidizi wa AI wa Smart Fundi. Ninaweza kukusaidia na usajili, malipo, ujumbe, na zaidi. Ninaweza kukusaidiaje leo?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    const escalationKeywords = ["agent", "call", "help me", "msaada", "piga simu"];
    if (escalationKeywords.some(keyword => lowerMessage.includes(keyword))) {
      setShowCallButton(true);
      return language === "en"
        ? "I understand you'd like to speak with a human agent. I've provided a 'Call Support' button below for you to contact our support team directly."
        : "Naelewa unataka kuzungumza na wakala wa binadamu. Nimekupa kitufe cha 'Piga Simu Msaada' hapo chini ili uwasiliane na timu yetu ya msaada moja kwa moja.";
    }

    if (lowerMessage.includes("register") || lowerMessage.includes("jisajili") || lowerMessage.includes("account")) {
      return language === "en"
        ? "To register on Smart Fundi:\n1. Click 'Sign Up' in the top navigation\n2. Choose your account type (Customer, Fundi, or Shop Owner)\n3. Fill in your details (name, email, password)\n4. For Fundis: Provide National ID or upload government-issued ID\n5. Click 'Create Account'\n\nNeed help with a specific step?"
        : "Kujisajili kwenye Smart Fundi:\n1. Bonyeza 'Jisajili' kwenye menyu ya juu\n2. Chagua aina ya akaunti (Mteja, Fundi, au Mmiliki wa Duka)\n3. Jaza maelezo yako (jina, barua pepe, nenosiri)\n4. Kwa Mafundi: Toa Kitambulisho cha Taifa au pakia kitambulisho kilichotolewa na serikali\n5. Bonyeza 'Fungua Akaunti'\n\nUnahitaji msaada na hatua maalum?";
    }

    if (lowerMessage.includes("id") || lowerMessage.includes("upload") || lowerMessage.includes("kitambulisho") || lowerMessage.includes("pakia")) {
      return language === "en"
        ? "For Fundi registration, you need identity verification:\n\n**Option 1 (Preferred):**\nEnter your National ID Number (Tanzania NIDA)\n\n**Option 2 (Alternative):**\nUpload a clear photo of:\n- Passport\n- Driver's License\n- Voter's Card\n- NIDA Application Receipt\n\nFile must be under 5MB. Alternative documents require admin verification before approval."
        : "Kwa usajili wa Fundi, unahitaji uthibitisho wa kitambulisho:\n\n**Chaguo 1 (Inayopendelewa):**\nWeka Nambari yako ya Kitambulisho cha Taifa (NIDA Tanzania)\n\n**Chaguo 2 (Mbadala):**\nPakia picha wazi ya:\n- Pasipoti\n- Leseni ya Kuendesha\n- Kadi ya Kupiga Kura\n- Risiti ya Maombi ya NIDA\n\nFaili lazima iwe chini ya 5MB. Hati mbadala zinahitaji uthibitisho wa msimamizi kabla ya kuidhinishwa.";
    }

    if (lowerMessage.includes("payment") || lowerMessage.includes("pay") || lowerMessage.includes("malipo") || lowerMessage.includes("lipa")) {
      return language === "en"
        ? "Smart Fundi Payment Information:\n\n**Subscription Fees:**\n- Fundi: 5,000 TZS/month (30-day free trial)\n- Shop: 15,000 TZS/month\n\n**Promoted Listings:**\n- 1,500 TZS/day for featured placement\n\n**Payment Methods:**\n- M-Pesa (Primary)\n- Stripe (Fallback)\n\nPayments are processed via secure webhooks. Your subscription auto-renews monthly."
        : "Taarifa za Malipo za Smart Fundi:\n\n**Ada za Usajili:**\n- Fundi: 5,000 TZS/mwezi (jaribio la siku 30 bure)\n- Duka: 15,000 TZS/mwezi\n\n**Uorodheshaji Uliotangazwa:**\n- 1,500 TZS/siku kwa nafasi maalum\n\n**Njia za Malipo:**\n- M-Pesa (Ya msingi)\n- Stripe (Ya hiari)\n\nMalipo yanashughulikiwa kupitia webhooks salama. Usajili wako unajiendesha kila mwezi.";
    }

    if (lowerMessage.includes("message") || lowerMessage.includes("chat") || lowerMessage.includes("ujumbe") || lowerMessage.includes("mawasiliano")) {
      return language === "en"
        ? "Smart Fundi Messaging System:\n\n**Privacy-First:**\n- Message providers without sharing your phone number\n- All conversations are private and secure\n\n**How to Message:**\n1. Find a Fundi or Shop you want to contact\n2. Click the 'Message' button on their profile\n3. Type your message and send\n\n**Features:**\n- Real-time messaging\n- Message history\n- Browser notifications\n- Typing indicators\n\nAccess your inbox from the Messages menu in the header."
        : "Mfumo wa Ujumbe wa Smart Fundi:\n\n**Faragha ya Kwanza:**\n- Tuma ujumbe kwa watoaji huduma bila kushiriki namba yako ya simu\n- Mazungumzo yote ni ya faragha na salama\n\n**Jinsi ya Kutuma Ujumbe:**\n1. Tafuta Fundi au Duka unalotaka kuwasiliana nao\n2. Bonyeza kitufe cha 'Tuma Ujumbe' kwenye wasifu wao\n3. Andika ujumbe wako na utume\n\n**Vipengele:**\n- Ujumbe wa wakati halisi\n- Historia ya ujumbe\n- Arifa za kivinjari\n- Viashiria vya kuandika\n\nFikia kikasha chako cha ujumbe kutoka kwenye menyu ya Ujumbe kwenye kichwa.";
    }

    if (lowerMessage.includes("fundi") || lowerMessage.includes("find") || lowerMessage.includes("search") || lowerMessage.includes("tafuta")) {
      return language === "en"
        ? "Finding Fundis on Smart Fundi:\n\n**Search by:**\n- City (Dar es Salaam, Arusha, Mwanza, etc.)\n- Specialty (Electrician, Plumber, Carpenter, etc.)\n- Rating and reviews\n\n**Featured Listings:**\nTop-rated and promoted fundis appear first\n\n**Verification:**\n- All fundis are verified by admin\n- Look for the blue checkmark badge\n- Read customer reviews before booking\n\n**Need a specific service?**\nTell me your city and specialty (e.g., 'Ninaomba fundi wa umeme Dar es Salaam')"
        : "Kutafuta Mafundi kwenye Smart Fundi:\n\n**Tafuta kwa:**\n- Jiji (Dar es Salaam, Arusha, Mwanza, n.k.)\n- Ujuzi (Fundi Umeme, Fundi Bomba, Seremala, n.k.)\n- Ukadiriaji na maoni\n\n**Uorodheshaji Maalum:**\n- Mafundi bora na waliofanyiwa matangazo huonekana kwanza\n\n**Uthibitisho:**\n- Mafundi wote wamethibitishwa na msimamizi\n- Tafuta alama ya kuangalia ya bluu\n- Soma maoni ya wateja kabla ya kuagiza\n\n**Unahitaji huduma maalum?**\nNiambie jiji lako na ujuzi (mfano, 'Ninaomba fundi wa umeme Dar es Salaam')";
    }

    if (lowerMessage.includes("dar") || lowerMessage.includes("arusha") || lowerMessage.includes("mwanza") || lowerMessage.includes("electrician") || lowerMessage.includes("plumber") || lowerMessage.includes("umeme") || lowerMessage.includes("bomba")) {
      return language === "en"
        ? "Great! Here's how to find what you need:\n\n1. Go to the 'Find Fundi' page (search icon in header)\n2. Select your city from the dropdown\n3. Choose the specialty you need\n4. Browse verified fundis with ratings\n5. Click 'Message' to contact them directly\n\nYou can also filter by:\n- Top rated fundis\n- Featured/promoted listings\n- Customer reviews\n\nWould you like help with anything else?"
        : "Nzuri! Hivi ndivyo unavyopata unachohitaji:\n\n1. Nenda kwenye ukurasa wa 'Tafuta Fundi' (ikoni ya utafutaji kwenye kichwa)\n2. Chagua jiji lako kutoka kwenye menyu kunjuzi\n3. Chagua ujuzi unaohitaji\n4. Vinjari mafundi wastahilifu wenye ukadiriaji\n5. Bonyeza 'Tuma Ujumbe' kuwasiliana nao moja kwa moja\n\nUnaweza pia kuchuja kwa:\n- Mafundi bora zaidi\n- Uorodheshaji maalum/uliotangazwa\n- Maoni ya wateja\n\nUngependa msaada na kitu kingine?";
    }

    return language === "en"
      ? "I'm here to help! I can assist with:\n\n- Creating an account\n- Uploading ID documents\n- Making payments\n- Using the messaging system\n- Finding fundis or shops\n- Understanding subscriptions\n\nWhat would you like to know more about?"
      : "Nipo hapa kusaidia! Ninaweza kusaidia na:\n\n- Kuunda akaunti\n- Kupakia hati za kitambulisho\n- Kufanya malipo\n- Kutumia mfumo wa ujumbe\n- Kutafuta mafundi au maduka\n- Kuelewa usajili\n\nUngependa kujua zaidi kuhusu nini?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    const aiResponse = getAIResponse(inputMessage);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInputMessage("");
  };

  const handleCallSupport = () => {
    window.location.href = `tel:${supportHotline}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>
              {language === "en" ? "Help & Support" : "Msaada na Usaidizi"}
            </CardTitle>
            <CardDescription>
              {language === "en" 
                ? "Ask our AI assistant anything about Smart Fundi" 
                : "Uliza msaidizi wetu wa AI chochote kuhusu Smart Fundi"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {showCallButton && (
          <Button
            onClick={handleCallSupport}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
          >
            <Phone className="h-5 w-5 mr-2" />
            {language === "en" ? "Call Support" : "Piga Simu Msaada"}
            <Badge variant="secondary" className="ml-2">{supportHotline}</Badge>
          </Button>
        )}

        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={language === "en" ? "Type your question..." : "Andika swali lako..."}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Bot className="h-4 w-4" />
          <span>
            {language === "en" 
              ? "AI-powered assistant • Bilingual support" 
              : "Msaidizi unaotumia AI • Msaada wa lugha mbili"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
