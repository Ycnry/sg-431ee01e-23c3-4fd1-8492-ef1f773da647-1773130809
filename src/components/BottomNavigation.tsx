import { useEffect, useState } from "react";

/**
 * BottomNavigation - RESET STATE
 * 
 * All previous navigation code has been removed.
 * Ready for fresh implementation.
 * 
 * Preserved requirements:
 * - Fixed at bottom
 * - Works on 320px–430px screens
 * - Content has padding-bottom: 70px
 * - No overflow, no horizontal scroll
 */

export function BottomNavigation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav
      className="bottom-nav-reset"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="bottom-nav-placeholder">
        <span>Navigation placeholder - ready for implementation</span>
      </div>
    </nav>
  );
}