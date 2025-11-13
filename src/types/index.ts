
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
  photo?: string;
  image?: string;
  joinedDate?: string;
  subscriptionActive?: boolean;
  promoted?: boolean;
  isPromoted?: boolean;
  nationalIdNumber?: string;
  idDocumentUrl?: string;
  idDocumentHash?: string;
  requiresManualVerification?: boolean;
  verificationStatus?: "pending" | "approved" | "rejected";
}

export interface Shop {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviewCount: number;
  image?: string;
  logo?: string;
  category: string;
  openingHours: string;
  phone?: string;
  whatsapp?: string;
  description: string;
  verified: boolean;
  ward?: string;
  categories?: string[];
  shopName?: string;
  subscriptionActive?: boolean;
  promoted?: boolean;
  isPromoted?: boolean;
  businessRegistrationNumber?: string;
  physicalAddress?: string;
  verificationStatus?: "pending" | "approved" | "rejected";
  businessLicenseUrl?: string;
  tinCertificateUrl?: string;
  storefrontPhotoUrl?: string;
  credentialsDocumentHash?: string;
  trustPoints?: number;
  customerVerifications?: number;
  scamReports?: number;
  communityVerified?: boolean;
  verifiedAt?: string;
  phoneVerified?: boolean;
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
