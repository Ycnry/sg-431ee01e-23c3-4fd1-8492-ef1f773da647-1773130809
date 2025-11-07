
export interface Translation {
  en: string;
  sw: string;
}

export type Language = "en" | "sw";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  createdAt: string;
}

export interface Fundi extends Omit<User, "photo"> {
  type: "fundi";
  specialty: string;
  city: string;
  bio: string;
  whatsapp?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  photo?: string; // Re-add to allow it, or use `image`
  image?: string; // Add image property
}

export interface Shop {
  id: string;
  name: string; // Shops have `name`, not `shopName` to be consistent with fundi
  city: string;
  rating: number;
  reviewCount: number;
  image?: string; // Use `image` consistently
  logo?: string;
  category: string;
  openingHours: string;
  phone?: string;
  whatsapp?: string;
  description: string;
  verified: boolean;
  ward?: string;
  categories?: string[];
  shopName?: string; // Keep for now for compatibility, but prefer `name`
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface Review {
  id: string;
  targetId: string;
  targetType: "fundi" | "shop";
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  language: Language;
  createdAt: string;
}

export interface Event {
  id: string;
  title: Translation;
  organizer: string;
  date: string;
  time: string;
  location: string;
  description: Translation;
  imageUrl: string;
  isSponsored: boolean;
  expectedAttendees: number;
}
