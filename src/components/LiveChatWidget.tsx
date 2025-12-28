import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSupportHotline, formatPhoneNumber, callSupportHotline } from "@/lib/settings";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface LiveChatWidgetProps {
  position?: "bottom-right" | "bottom-left";
}

export function LiveChatWidget({ position = "bottom-right" }: LiveChatWidgetProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [supportHotline, setSupportHotline] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: "Live Chat Support",
        subtitle: "We're here to help!",
        placeholder: "Type your message...",
        send: "Send",
        typing: "Support agent is typing...",
        minimize: "Minimize",
        close: "Close",
        quickActions: "Quick Actions",
        findFundi: "Find a Fundi",
        payment: "Payment Help",
        account: "Account Issues",
        callSupport: "Call Support",
        agentOnline: "Agent Online",
        welcomeMessage: "Hello! How can we assist you today?",
        welcomeMessageSw: "Habari! Tunaweza kukusaidia vipi leo?",
      },
      sw: {
        title: "Mazungumzo ya Msaada",
        subtitle: "Tuko hapa kukusaidia!",
        placeholder: "Andika ujumbe wako...",
        send: "Tuma",
        typing: "Msaidizi anaandika...",
        minimize: "Punguza",
        close: "Funga",
        quickActions: "Vitendo vya Haraka",
        findFundi: "Tafuta Fundi",
        payment: "Msaada wa Malipo",
        account: "Matatizo ya Akaunti",
        callSupport: "Piga Simu",
        agentOnline: "Msaidizi Yupo",
        welcomeMessage: "Hello! How can we assist you today?",
        welcomeMessageSw: "Habari! Tunaweza kukusaidia vipi leo?",
      },
    };
    return translations[language]?.[key] || translations.en[key];
  };

  useEffect(() => {
    setSupportHotline(getSupportHotline());
    
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem("smartfundi_chat_history");
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })));
    } else {
      // Send welcome message
      const welcomeMsg: ChatMessage = {
        id: Date.now().toString(),
        text: language === "en" ? t("welcomeMessage") : t("welcomeMessageSw"),
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  useEffect(() => {
    // Save chat history to localStorage
    if (messages.length > 0) {
      localStorage.setItem("smartfundi_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Update unread count when new agent messages arrive and chat is closed
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

    // Simulate agent response
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
        ? "To find a verified technician, visit our homepage and browse through our Featured Fundis or use the search function to find specialists in your area."
        : "Ili kupata fundi aliyethibitishwa, tembelea ukurasa wetu wa nyumbani na angalia Fundi Bora au tumia utafutaji kupata wataalamu katika eneo lako.";
    }
    
    if (msg.includes("pay") || msg.includes("malipo") || msg.includes("m-pesa")) {
      return language === "en"
        ? "For payment assistance, please visit our 'How to Pay' guide in the Help section. We support M-Pesa, Airtel Money, and bank SIM banking."
        : "Kwa msaada wa malipo, tafadhali tembelea mwongozo wetu wa 'Jinsi ya Kulipa' katika sehemu ya Msaada. Tunasaidia M-Pesa, Airtel Money, na SIM banking ya benki.";
    }
    
    if (msg.includes("account") || msg.includes("akaunti") || msg.includes("login")) {
      return language === "en"
        ? "For account issues, please make sure you're using the correct phone number or email. If you need further assistance, you can call our support hotline."
        : "Kwa matatizo ya akaunti, tafadhali hakikisha unatumia nambari sahihi ya simu au barua pepe. Ikiwa unahitaji msaada zaidi, unaweza kupiga simu kwa msaada wetu.";
    }
    
    return language === "en"
      ? "Thank you for your message. A support agent will assist you shortly. For immediate help, please call our support hotline."
      : "Asante kwa ujumbe wako. Msaidizi atakusaidia hivi karibuni. Kwa msaada wa haraka, tafadhali piga simu kwa msaada wetu.";
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  const positionClasses = position === "bottom-right" 
    ? "bottom-4 right-4" 
    : "bottom-4 left-4";

  if (!isOpen) {
    return (
      <div className={`fixed ${positionClasses} z-50`}>
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className="rounded-full h-16 w-16 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 relative group"
        >
          <MessageCircle className="h-8 w-8 group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      <Card
        className={`w-96 shadow-2xl border-2 transition-all duration-300 ${
          isMinimized ? "h-16" : "h-[600px]"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t("title")}</h3>
              <p className="text-xs text-blue-100">{t("agentOnline")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-white hover:bg-blue-700"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-blue-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
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
                  <div className="bg-white dark:bg-gray-800 border rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {t("quickActions")}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuickAction(
                      language === "en" ? "I need to find a fundi" : "Ninahitaji kupata fundi"
                    )
                  }
                  className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900"
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
                  className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900"
                >
                  {t("payment")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={callSupportHotline}
                  className="text-xs hover:bg-green-50 dark:hover:bg-green-900 hover:scale-105 transition-transform"
                >
                  {t("callSupport")}
                </Button>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white dark:bg-gray-800">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={t("placeholder")}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}