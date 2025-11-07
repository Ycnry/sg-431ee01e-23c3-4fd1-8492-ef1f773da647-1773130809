
export interface BugReport {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  resolvedAt?: string;
}

export interface UserStats {
  totalCustomers: number;
  totalFundis: number;
  totalShops: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  newUsersThisMonth: number;
}

export interface GeographicData {
  city: string;
  signups: number;
  lat: number;
  lng: number;
}

export interface LanguageStats {
  english: number;
  swahili: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  currency: "TZS";
}

export const mockUserStats: UserStats = {
  totalCustomers: 3847,
  totalFundis: 892,
  totalShops: 156,
  activeSubscriptions: 721,
  expiredSubscriptions: 327,
  newUsersThisMonth: 234
};

export const mockGeographicData: GeographicData[] = [
  { city: "Dar es Salaam", signups: 1456, lat: -6.7924, lng: 39.2083 },
  { city: "Arusha", signups: 687, lat: -3.3869, lng: 36.6830 },
  { city: "Mwanza", signups: 512, lat: -2.5164, lng: 32.9175 },
  { city: "Dodoma", signups: 398, lat: -6.1630, lng: 35.7516 },
  { city: "Mbeya", signups: 287, lat: -8.9094, lng: 33.4606 },
  { city: "Morogoro", signups: 243, lat: -6.8235, lng: 37.6609 },
  { city: "Tanga", signups: 189, lat: -5.0689, lng: 39.0982 },
  { city: "Zanzibar", signups: 167, lat: -6.1659, lng: 39.2026 }
];

export const mockLanguageStats: LanguageStats = {
  english: 62,
  swahili: 38
};

export const mockRevenueData: RevenueData[] = [
  { month: "Jan", revenue: 8500000, currency: "TZS" },
  { month: "Feb", revenue: 9200000, currency: "TZS" },
  { month: "Mar", revenue: 11400000, currency: "TZS" },
  { month: "Apr", revenue: 10800000, currency: "TZS" },
  { month: "May", revenue: 12600000, currency: "TZS" },
  { month: "Jun", revenue: 13900000, currency: "TZS" }
];

export const mockBugReports: BugReport[] = [
  {
    id: "bug-001",
    userId: "user-123",
    userName: "John Kamau",
    title: "Payment not processing",
    description: "M-Pesa payment confirmation received but subscription not activated",
    category: "Payment",
    priority: "high",
    status: "open",
    createdAt: "2025-11-06T14:30:00Z"
  },
  {
    id: "bug-002",
    userId: "user-456",
    userName: "Amina Hassan",
    title: "Profile image not uploading",
    description: "Cannot upload profile picture, shows error after selecting file",
    category: "Profile",
    priority: "medium",
    status: "in-progress",
    createdAt: "2025-11-05T10:15:00Z"
  },
  {
    id: "bug-003",
    userId: "user-789",
    userName: "David Mwangi",
    title: "Search results not showing",
    description: "When searching for fundis in Arusha, no results appear even though there are verified fundis",
    category: "Search",
    priority: "high",
    status: "open",
    createdAt: "2025-11-04T16:45:00Z"
  },
  {
    id: "bug-004",
    userId: "user-234",
    userName: "Fatuma Juma",
    title: "Messages not delivering",
    description: "Sent messages to fundi but they appear as 'sending' for hours",
    category: "Messaging",
    priority: "high",
    status: "open",
    createdAt: "2025-11-03T09:20:00Z"
  },
  {
    id: "bug-005",
    userId: "user-567",
    userName: "Peter Omondi",
    title: "Language toggle not working on mobile",
    description: "Swahili/English toggle button doesn't respond on Android devices",
    category: "UI",
    priority: "medium",
    status: "resolved",
    createdAt: "2025-11-01T11:30:00Z",
    resolvedAt: "2025-11-02T14:00:00Z"
  }
];

export function formatTZS(amount: number): string {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
