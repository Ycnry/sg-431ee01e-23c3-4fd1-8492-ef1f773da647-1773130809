import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ChatInterface } from "@/components/messaging/ChatInterface";
import { ConversationList } from "@/components/messaging/ConversationList";
import { Card, CardContent } from "@/components/ui/card";
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

  /* Empty State Component */
  const EmptyMessagesState = () => (
    <Card className="bg-card border border-border">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-8 w-8 text-orange-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          No Messages Yet
        </h3>
        <p className="text-muted-foreground text-sm mb-1">
          Hakuna ujumbe bado
        </p>
        <p className="text-muted-foreground text-xs">
          Anza mazungumzo na fundi au duka kupata msaada
        </p>
      </CardContent>
    </Card>
  );

  /* Select Conversation Empty State */
  const SelectConversationState = () => (
    <div className="h-[600px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-card">
      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
        <MessageSquare className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">
        Select a Conversation
      </h3>
      <p className="text-muted-foreground text-sm mb-1">
        Chagua mazungumzo kuanza
      </p>
      <p className="text-muted-foreground text-xs text-center px-4">
        Bofya kwenye mazungumzo kushoto ili kutuma ujumbe
      </p>
    </div>
  );

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
                {mockConversations.length > 0 ? (
                  <ConversationList
                    conversations={mockConversations}
                    onSelectConversation={setSelectedConversation}
                    selectedId={selectedConversation}
                  />
                ) : (
                  <EmptyMessagesState />
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
              {mockConversations.length > 0 ? (
                <ConversationList
                  conversations={mockConversations}
                  onSelectConversation={setSelectedConversation}
                  selectedId={selectedConversation}
                />
              ) : (
                <EmptyMessagesState />
              )}
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
                <SelectConversationState />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}