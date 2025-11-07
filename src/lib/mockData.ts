import { Fundi, Shop, Event, Translation } from "@/types";
import { SubscriptionStatus } from "@/types/payments";

export const mockFundis: Fundi[] = [
  {
    id: "1",
    name: "John Kamau",
    specialty: "Electrician",
    city: "Dar es Salaam",
    rating: 4.8,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Certified electrician with 10+ years of experience in residential and commercial installations.",
    phone: "+255 712 345 678",
    whatsapp: "+255 712 345 678",
    verified: true,
    joinedDate: "2023-01-15"
  },
  {
    id: "2",
    name: "Amina Hassan",
    specialty: "Plumber",
    city: "Arusha",
    rating: 4.9,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Expert plumber specializing in pipe installations, repairs, and water system maintenance.",
    phone: "+255 754 234 567",
    whatsapp: "+255 754 234 567",
    verified: true,
    joinedDate: "2023-03-20"
  },
  {
    id: "3",
    name: "David Mwangi",
    specialty: "Carpenter",
    city: "Mwanza",
    rating: 4.7,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "Skilled carpenter crafting custom furniture and handling all woodwork projects.",
    phone: "+255 765 345 789",
    whatsapp: "+255 765 345 789",
    verified: true,
    joinedDate: "2022-11-10"
  }
];

export const mockShops: Shop[] = [
  {
    id: "shop1",
    name: "Dar Hardware Supplies",
    shopName: "Dar Hardware Supplies",
    city: "Dar es Salaam",
    rating: 4.6,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop",
    category: "Hardware Store",
    openingHours: "Mon-Sat: 8AM-6PM",
    phone: "+255 713 456 789",
    whatsapp: "+255 713 456 789",
    description: "Complete hardware supplies for construction and repairs. Quality tools and materials.",
    verified: true
  },
  {
    id: "shop2",
    name: "Arusha Tool Center",
    shopName: "Arusha Tool Center",
    city: "Arusha",
    rating: 4.8,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop",
    category: "Tool Shop",
    openingHours: "Mon-Sat: 7:30AM-7PM",
    phone: "+255 756 567 890",
    whatsapp: "+255 756 567 890",
    description: "Professional tools and equipment for all trades. Expert advice available.",
    verified: true
  }
];

export const mockSubscriptionStatuses: SubscriptionStatus[] = [
  {
    userId: "1",
    userType: "fundi",
    isActive: true,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isPromoted: true,
    promotionExpiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastPaymentDate: new Date().toISOString(),
    paymentMethod: "mpesa",
    transactionId: "MPESA123456"
  },
  {
    userId: "2",
    userType: "fundi",
    isActive: true,
    expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    isPromoted: false,
    lastPaymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: "stripe",
    transactionId: "STRIPE789012"
  },
  {
    userId: "3",
    userType: "fundi",
    isActive: true,
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    isPromoted: false,
    lastPaymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: "mpesa",
    transactionId: "MPESA345678"
  },
  {
    userId: "shop1",
    userType: "shop",
    isActive: true,
    expiryDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    isPromoted: true,
    promotionExpiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastPaymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: "mpesa",
    transactionId: "MPESA567890"
  },
  {
    userId: "shop2",
    userType: "shop",
    isActive: true,
    expiryDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    isPromoted: false,
    lastPaymentDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: "stripe",
    transactionId: "STRIPE234567"
  }
];

export function initializeMockSubscriptions() {
  if (typeof window !== "undefined") {
    const existing = localStorage.getItem("smartfundi_subscriptions");
    if (!existing) {
      localStorage.setItem("smartfundi_subscriptions", JSON.stringify(mockSubscriptionStatuses));
      console.log("Initialized mock subscription data");
    }
  }
}

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: {
      en: "Tanzania Construction Technology Expo 2025",
      sw: "Maonyesho ya Teknolojia ya Ujenzi Tanzania 2025",
    },
    description: {
      en: "Annual exhibition showcasing the latest construction tools, materials, and techniques for professionals across Tanzania.",
      sw: "Maonyesho ya kila mwaka yanayoonyesha zana za hivi karibuni za ujenzi, vifaa, na mbinu kwa wataalamu nchini Tanzania.",
    },
    organizer: "Tanzania Builders Association",
    location: "Diamond Jubilee Hall, Dar es Salaam",
    date: new Date(Date.now() + 15 * 86400000).toISOString(),
    time: "9:00 AM - 5:00 PM",
    isSponsored: true,
    imageUrl: `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop`,
    expectedAttendees: 500,
  },
  {
    id: "e2",
    title: {
      en: "Electrical Safety Training Workshop",
      sw: "Warsha ya Mafunzo ya Usalama wa Umeme",
    },
    description: {
      en: "Free training workshop on electrical safety standards and best practices for electricians and apprentices.",
      sw: "Warsha ya bure ya mafunzo kuhusu viwango vya usalama wa umeme na mbinu bora kwa wafundi umeme na wanafunzi.",
    },
    organizer: "Tanzania Electrical Institute",
    location: "Vocational Training Center, Arusha",
    date: new Date(Date.now() + 8 * 86400000).toISOString(),
    time: "10:00 AM - 1:00 PM",
    isSponsored: false,
    imageUrl: `https://images.unsplash.com/photo-1581092921462-6849a6e3a453?q=80&w=2070&auto=format&fit=crop`,
    expectedAttendees: 50,
  },
  {
    id: "e3",
    title: {
      en: "Automotive Repair Skills Fair",
      sw: "Maonyesho ya Ujuzi wa Urekebishaji wa Magari",
    },
    description: {
      en: "Meet industry experts, learn new techniques, and discover the latest automotive tools and diagnostic equipment.",
      sw: "Kutana na wataalamu wa sekta, jifunze mbinu mpya, na gundua zana za hivi karibuni za magari na vifaa vya uchunguzi.",
    },
    organizer: "Tanzania Automotive Association",
    location: "Mlimani City Conference Center, Dar es Salaam",
    date: new Date(Date.now() + 22 * 86400000).toISOString(),
    time: "8:30 AM - 6:00 PM",
    isSponsored: true,
    imageUrl: `https://images.unsplash.com/photo-1553775282-20af807797d2?q=80&w=2070&auto=format&fit=crop`,
    expectedAttendees: 300,
  },
];
