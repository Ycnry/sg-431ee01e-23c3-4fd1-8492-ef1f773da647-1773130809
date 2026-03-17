import { useEffect, useState } from "react";

/**
 * BottomNavigation - RESET STATE
 * 
 * This component has been completely reset and is ready for fresh implementation.
 * 
 * Mobile requirements preserved:
 * - Fixed at bottom
 * - Works on 320px–430px screens
 * - Content has padding-bottom: 70px (handled in globals.css body)
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
      {/* Ready for fresh implementation */}
      <div className="bottom-nav-placeholder">
        <span>Navigation placeholder - ready for implementation</span>
      </div>
    </nav>
  );
}