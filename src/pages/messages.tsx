import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ChatInterface } from "@/components/messaging/ChatInterface";
import { ConversationList } from "@/components/messaging/ConversationList";
import { useLanguage } from "@/contexts/LanguageContext";
import { Conversation } from "@/types";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  const { t, language } = useLanguage();
  const [selectedConversation, setSelectedConversation] = useState<string | undefined>();
  
  const mockConversations: Conversation[] = [
    {
      id: "conv1",
      participants: ["current-user", "user1"],
      lastMessage: {
        id: "msg1",
        conversationId: "conv1",
        senderId: "user1",
        receiverId: "current-user",
        text: "Hello, I need help with electrical installation",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "conv2",
      participants: ["current-user", "user2"],
      lastMessage: {
        id: "msg2",
        conversationId: "conv2",
        senderId: "current-user",
        receiverId: "user2",
        text: "Thank you for your service",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
      },
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const metaTitle = language === "en" ? "Messages - Smart Fundi" : "Ujumbe - Smart Fundi";

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <Header />
        
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pt-20 sm:pt-24">
          {/* Mobile: Show either list or chat */}
          <div className="lg:hidden">
            {selectedConversation ? (
              <div className="h-[calc(100vh-160px)]">
                <ChatInterface
                  recipientName="John Mwangi"
                  recipientPhoto="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                  conversationId={selectedConversation}
                  onBack={() => setSelectedConversation(undefined)}
                />
              </div>
            ) : (
              <div>
                <h1 className="text-xl font-bold mb-4">
                  {language === "en" ? "Messages" : "Ujumbe"}
                </h1>
                <ConversationList
                  conversations={mockConversations}
                  onSelectConversation={setSelectedConversation}
                  selectedId={selectedConversation}
                />
                {mockConversations.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {language === "en" 
                        ? "No messages yet. Start a conversation with a fundi or shop!" 
                        : "Hakuna ujumbe bado. Anza mazungumzo na fundi au duka!"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Desktop: Side-by-side layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h1 className="text-xl font-bold mb-4">
                {language === "en" ? "Messages" : "Ujumbe"}
              </h1>
              <ConversationList
                conversations={mockConversations}
                onSelectConversation={setSelectedConversation}
                selectedId={selectedConversation}
              />
            </div>
            
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <ChatInterface
                  recipientName="John Mwangi"
                  recipientPhoto="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                  conversationId={selectedConversation}
                  onBack={() => setSelectedConversation(undefined)}
                />
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center px-4">
                    {t("messaging.selectChat") || (language === "en" 
                      ? "Select a conversation to start messaging" 
                      : "Chagua mazungumzo kuanza kutuma ujumbe")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <BottomNavigation />
      </div>
    </>
  );
}