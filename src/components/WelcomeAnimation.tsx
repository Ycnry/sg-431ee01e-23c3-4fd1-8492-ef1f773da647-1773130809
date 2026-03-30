import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface WelcomeAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export function WelcomeAnimation({ show, onComplete }: WelcomeAnimationProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => {
            setTimeout(onComplete, 2000);
          }}
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: "#0d1b2e" }}
        >
          {/* Centered radial glow behind text */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(26, 60, 110, 0.5) 0%, rgba(26, 60, 110, 0.2) 35%, transparent 65%)"
            }}
          />

          <div className="text-center px-6 relative z-10">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-6xl md:text-7xl font-bold text-white mb-4"
            >
              {t("welcome.title")}
            </motion.h1>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              {t("welcome.title") === "Welcome" ? "Karibu" : "Welcome"}
            </motion.div>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "#A0AEC0" }}
            >
              {t("welcome.subtitle")}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
