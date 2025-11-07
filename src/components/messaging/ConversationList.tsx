
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { Conversation } from "@/types";

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  selectedId?: string;
}

export function ConversationList({ conversations, onSelectConversation, selectedId }: ConversationListProps) {
  const { t } = useLanguage();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="h-[600px] max-h-[80vh]">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">{t("messaging.inbox") || "Messages"}</h2>
      </div>
      
      <ScrollArea className="h-[calc(100%-73px)]">
        <div className="divide-y">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>{t("messaging.noMessages") || "No messages yet"}</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                  selectedId === conversation.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.id}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">Contact {conversation.id.slice(0, 8)}</h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.text}
                        </p>
                        {!conversation.lastMessage.read && (
                          <Badge className="ml-2 bg-blue-600">New</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
