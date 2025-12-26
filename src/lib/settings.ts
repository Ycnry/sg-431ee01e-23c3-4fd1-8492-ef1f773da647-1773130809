/**
 * App Settings Management
 * Stores configuration like support hotline in localStorage
 * In production with Supabase, this would use a database table with admin-only access
 */

export interface AppSettings {
  hotline_number: string;
  last_updated: string;
  updated_by?: string;
}

const SETTINGS_KEY = "app_settings_support_contact";
const DEFAULT_HOTLINE = "+255796381261";

/**
 * Get the current support hotline number
 */
export function getSupportHotline(): string {
  if (typeof window === "undefined") return DEFAULT_HOTLINE;
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const settings: AppSettings = JSON.parse(stored);
      return settings.hotline_number || DEFAULT_HOTLINE;
    }
  } catch (error) {
    console.error("Error reading support hotline:", error);
  }
  
  return DEFAULT_HOTLINE;
}

/**
 * Update the support hotline number (Admin only)
 */
export function updateSupportHotline(
  hotline: string,
  adminEmail?: string
): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const settings: AppSettings = {
      hotline_number: hotline,
      last_updated: new Date().toISOString(),
      updated_by: adminEmail,
    };
    
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Error updating support hotline:", error);
    return false;
  }
}

/**
 * Get all app settings
 */
export function getAppSettings(): AppSettings {
  if (typeof window === "undefined") {
    return {
      hotline_number: DEFAULT_HOTLINE,
      last_updated: new Date().toISOString(),
    };
  }
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading app settings:", error);
  }
  
  return {
    hotline_number: DEFAULT_HOTLINE,
    last_updated: new Date().toISOString(),
  };
}

/**
 * Trigger phone call to support hotline
 */
export function callSupportHotline(): void {
  const hotline = getSupportHotline();
  // Remove spaces and formatting for tel: protocol
  const cleanNumber = hotline.replace(/\s+/g, "");
  window.location.href = `tel:${cleanNumber}`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Format: +255 796 381 261
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("255")) {
    return `+255 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}