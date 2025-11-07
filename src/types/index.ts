
export interface Translation {
  en: string;
  sw: string;
}

export type Language = "en" | "sw";

export interface User {
  id: string;
  type: "customer" | "fundi" | "shop" | "admin";
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  createdAt: string;
}

export interface Fundi extends User {
  type: "fundi";
  specialty: string;
  city: string;
  bio: string;
  whatsapp?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  subscriptionActive: boolean;
  subscriptionExpiry?: string;
  promoted?: boolean;
  promotedUntil?: string;
}

export interface Shop extends User {
  type: "shop";
  shopName: string;
  logo?: string;
  city: string;
  ward: string;
  categories: string[];
  openingHours: string;
  whatsapp?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  subscriptionActive: boolean;
  subscriptionExpiry?: string;
  promoted?: boolean;
  promotedUntil?: string;
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
