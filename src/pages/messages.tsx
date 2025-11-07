
import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/messaging/ChatInterface";
import { ConversationList } from "@/components/messaging/ConversationList";
import { useLanguage } from "@/contexts/LanguageContext";
import { Conversation } from "@/types";

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
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
                <div className="h-[600px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    {t("messaging.selectChat") || "Select a conversation to start messaging"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
