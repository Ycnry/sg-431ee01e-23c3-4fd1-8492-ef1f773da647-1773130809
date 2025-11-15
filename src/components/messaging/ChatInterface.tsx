
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Send, ArrowLeft, Paperclip, Camera, X, Play, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Message } from "@/types";
import { uploadMedia, validateMediaFile } from "@/lib/mediaUpload";

interface ChatInterfaceProps {
  recipientName: string;
  recipientPhoto?: string;
  conversationId: string;
  onBack?: () => void;
}

export function ChatInterface({ recipientName, recipientPhoto, conversationId, onBack }: ChatInterfaceProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = "current-user-id";

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_${conversationId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: currentUserId,
      receiverId: "recipient-id",
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${conversationId}`, JSON.stringify(updatedMessages));
    setNewMessage("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleMediaSelect = async (file: File) => {
    // Validate file
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploadingMedia(true);
    setUploadProgress(0);

    // Upload media with progress tracking
    const result = await uploadMedia(file, (progress) => {
      setUploadProgress(progress);
    });

    setUploadingMedia(false);

    if (!result.success) {
      alert(result.error || "Upload failed. Please try again.");
      return;
    }

    // Create media message
    const mediaMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: currentUserId,
      receiverId: "recipient-id",
      text: "",
      timestamp: new Date().toISOString(),
      read: false,
      mediaUrl: result.mediaUrl,
      mediaType: result.mediaType,
      thumbnailUrl: result.thumbnailUrl,
      fileSize: result.fileSize,
    };

    const updatedMessages = [...messages, mediaMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${conversationId}`, JSON.stringify(updatedMessages));

    // Simulate recipient typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleMediaSelect(file);
    }
    // Reset input
    e.target.value = "";
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <>
      <Card className="flex flex-col h-[600px] max-h-[80vh]">
        <div className="flex items-center gap-3 p-4 border-b">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <AvatarImage src={recipientPhoto} alt={recipientName} />
            <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{recipientName}</h3>
            {isTyping && <p className="text-xs text-muted-foreground">typing...</p>}
          </div>
        </div>

        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.senderId === currentUserId;
              const hasMedia = message.mediaUrl && message.mediaType;

              return (
                <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                    {hasMedia && (
                      <div
                        className={`mb-2 rounded-2xl overflow-hidden cursor-pointer ${
                          isOwn ? "rounded-br-sm" : "rounded-bl-sm"
                        }`}
                        onClick={() => setSelectedMedia({ url: message.mediaUrl!, type: message.mediaType! })}
                      >
                        {message.mediaType === "image" ? (
                          <div className="relative group">
                            <img
                              src={message.thumbnailUrl || message.mediaUrl}
                              alt="Shared image"
                              className="w-full h-auto max-w-[300px] rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                          </div>
                        ) : (
                          <div className="relative group">
                            <img
                              src={message.thumbnailUrl}
                              alt="Video thumbnail"
                              className="w-full h-auto max-w-[300px] rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/60 rounded-full p-4">
                                <Play className="h-8 w-8 text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                        {message.fileSize && (
                          <p className="text-xs text-muted-foreground mt-1 px-2">
                            {formatFileSize(message.fileSize)}
                          </p>
                        )}
                      </div>
                    )}

                    {message.uploadError && (
                      <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                          <AlertCircle className="h-4 w-4" />
                          <p className="text-sm">{message.uploadError}</p>
                        </div>
                      </div>
                    )}

                    {message.text && (
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isOwn
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-muted rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    )}

                    <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? "text-right" : "text-left"}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}

            {uploadingMedia && (
              <div className="flex justify-end">
                <div className="max-w-[70%] bg-blue-50 dark:bg-blue-900/20 rounded-2xl rounded-br-sm p-4">
                  <p className="text-sm text-muted-foreground mb-2">Uploading media...</p>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {Math.round(uploadProgress)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,video/mp4,video/quicktime"
              onChange={handleFileInput}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*,video/*"
              capture="environment"
              onChange={handleFileInput}
              className="hidden"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingMedia}
              title="Attach photo or video"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploadingMedia}
              title="Take photo or video"
            >
              <Camera className="h-5 w-5" />
            </Button>

            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={t("messaging.typePlaceholder") || "Type a message..."}
              className="flex-1"
              disabled={uploadingMedia}
            />

            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={uploadingMedia || !newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Full-screen media viewer */}
      <Dialog open={selectedMedia !== null} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setSelectedMedia(null)}
            >
              <X className="h-5 w-5" />
            </Button>

            {selectedMedia?.type === "image" ? (
              <img
                src={selectedMedia.url}
                alt="Full size"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            ) : selectedMedia?.type === "video" ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="w-full h-auto max-h-[85vh]"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
