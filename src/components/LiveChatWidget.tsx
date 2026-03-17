import { useState, useEffect, useRef } from "react";
import { X, Send, Minimize2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSupportHotline, callSupportHotline } from "@/lib/settings";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface LiveChatWidgetProps {
  position?: "bottom-right" | "bottom-left";
}

// Custom MessageCircle SVG icon to avoid any icon library issues
function MessageCircleIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

export function LiveChatWidget({ position = "bottom-right" }: LiveChatWidgetProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: "Live Chat",
        subtitle: "We're here to help!",
        placeholder: "Type your message...",
        send: "Send",
        typing: "Agent is typing...",
        minimize: "Minimize",
        close: "Close",
        quickActions: "Quick Actions",
        findFundi: "Find a Fundi",
        payment: "Payment Help",
        account: "Account Issues",
        callSupport: "Call Support",
        agentOnline: "Online",
        welcomeMessage: "Hello! How can we assist you today?",
      },
      sw: {
        title: "Mazungumzo",
        subtitle: "Tuko hapa kukusaidia!",
        placeholder: "Andika ujumbe...",
        send: "Tuma",
        typing: "Msaidizi anaandika...",
        minimize: "Punguza",
        close: "Funga",
        quickActions: "Vitendo vya Haraka",
        findFundi: "Tafuta Fundi",
        payment: "Msaada wa Malipo",
        account: "Matatizo ya Akaunti",
        callSupport: "Piga Simu",
        agentOnline: "Yupo",
        welcomeMessage: "Habari! Tunaweza kukusaidia vipi leo?",
      },
    };
    return translations[language]?.[key] || translations.en[key];
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem("smartfundi_chat_history");
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((msg: ChatMessage) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })));
    } else {
      const welcomeMsg: ChatMessage = {
        id: Date.now().toString(),
        text: t("welcomeMessage"),
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("smartfundi_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      const unread = messages.filter(
        (msg) => msg.sender === "agent" && msg.timestamp > new Date(Date.now() - 5000)
      ).length;
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAgentResponse(inputMessage),
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const getAgentResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("fundi") || msg.includes("technician")) {
      return language === "en"
        ? "To find a verified technician, visit our homepage and browse through our Featured Fundis or use the search function."
        : "Ili kupata fundi aliyethibitishwa, tembelea ukurasa wetu wa nyumbani na angalia Fundi Bora au tumia utafutaji.";
    }
    
    if (msg.includes("pay") || msg.includes("malipo") || msg.includes("m-pesa")) {
      return language === "en"
        ? "For payment help, visit our 'How to Pay' guide. We support M-Pesa, Airtel Money, Tigo Pesa, and Halopesa."
        : "Kwa msaada wa malipo, tembelea mwongozo wetu wa 'Jinsi ya Kulipa'. Tunasaidia M-Pesa, Airtel Money, Tigo Pesa, na Halopesa.";
    }
    
    if (msg.includes("account") || msg.includes("akaunti") || msg.includes("login")) {
      return language === "en"
        ? "For account issues, make sure you're using the correct phone number or email. Need more help? Call our support line."
        : "Kwa matatizo ya akaunti, hakikisha unatumia nambari sahihi ya simu au barua pepe. Unahitaji msaada zaidi? Piga simu msaada wetu.";
    }
    
    return language === "en"
      ? "Thank you for your message. A support agent will assist you shortly. For immediate help, call our support hotline."
      : "Asante kwa ujumbe wako. Msaidizi atakusaidia hivi karibuni. Kwa msaada wa haraka, piga simu msaada wetu.";
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  // FIXED: Position classes - always on the RIGHT side, never left
  // This prevents overlap with the Nyumbani tab on the left
  const positionClasses = "right-4";

  // FIXED: Bottom positioning - always 96px (24 * 4) above viewport bottom
  // This ensures it's always above the 65px navigation bar with safe spacing
  const bottomPosition = "bottom-24"; // 96px - well above the 65px nav bar

  // Floating button when chat is closed
  if (!isOpen) {
    return (
      <div 
        className={`fixed ${bottomPosition} ${positionClasses} z-40`}
        style={{ 
          bottom: "calc(65px + 24px + env(safe-area-inset-bottom))" 
        }}
      >
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 relative"
          aria-label={t("title")}
        >
          <MessageCircleIcon className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 text-xs animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  // Chat window when open
  return (
    <div 
      className={`fixed ${positionClasses} z-40`}
      style={{ 
        bottom: "calc(65px + 16px + env(safe-area-inset-bottom))" 
      }}
    >
      <Card
        className={`w-[calc(100vw-32px)] sm:w-80 md:w-96 shadow-2xl border transition-all duration-300 ${
          isMinimized ? "h-14" : "h-[50vh] sm:h-[450px] max-h-[60vh]"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex-shrink-0">
              <MessageCircleIcon className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-green-400 rounded-full" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">{t("title")}</h3>
              <p className="text-[10px] sm:text-xs text-blue-100">{t("agentOnline")}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20"
              aria-label={t("minimize")}
            >
              <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20"
              aria-label={t("close")}
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <div className="flex flex-col h-[calc(100%-48px)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-xs sm:text-sm break-words">{msg.text}</p>
                    <span className="text-[10px] opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border rounded-xl rounded-bl-none px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-2 border-t bg-gray-50 dark:bg-gray-900 flex-shrink-0">
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuickAction(
                      language === "en" ? "I need to find a fundi" : "Ninahitaji kupata fundi"
                    )
                  }
                  className="text-[10px] sm:text-xs h-7 px-2"
                >
                  {t("findFundi")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuickAction(
                      language === "en" ? "Help with payment" : "Msaada wa malipo"
                    )
                  }
                  className="text-[10px] sm:text-xs h-7 px-2"
                >
                  {t("payment")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={callSupportHotline}
                  className="text-[10px] sm:text-xs h-7 px-2 text-green-600 border-green-300 hover:bg-green-50"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  {t("callSupport")}
                </Button>
              </div>
            </div>

            {/* Input */}
            <div className="p-2 sm:p-3 border-t bg-white dark:bg-gray-800 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={t("placeholder")}
                  className="flex-1 h-9 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 h-9 w-9 flex-shrink-0"
                  aria-label={t("send")}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}