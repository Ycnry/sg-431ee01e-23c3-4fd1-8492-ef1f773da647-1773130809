"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#0d1b2e" }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Subtle radial glow effect centered */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(26, 60, 110, 0.4) 0%, rgba(26, 60, 110, 0.1) 40%, transparent 70%)"
          }}
        />

        {/* Animated background grid */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

        {/* Floating particles - render only on client */}
        {isClient && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 400),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800)],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo container with glow effect */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 1,
            }}
          >
            {/* Glow effect behind logo */}
            <motion.div
              className="absolute inset-0 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full rounded-full" style={{ backgroundColor: "#1A3C6E" }} />
            </motion.div>

            {/* Main logo */}
            <motion.div
              className="relative bg-white p-8 rounded-3xl shadow-2xl"
              animate={{
                y: [0, -10, 0],
                boxShadow: [
                  "0 20px 60px rgba(26, 60, 110, 0.4)",
                  "0 30px 80px rgba(26, 60, 110, 0.5)",
                  "0 20px 60px rgba(26, 60, 110, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.img
                src="/F.png"
                alt="Smart Fundi Logo"
                className="w-32 h-32 object-contain"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Rotating ring around logo */}
            <motion.div
              className="absolute inset-0 border-4 border-orange-500/30 rounded-3xl"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          </motion.div>

          {/* Brand name */}
          <motion.div
            className="mt-8 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl font-bold text-white"
              animate={{
                textShadow: [
                  "0 0 20px rgba(26, 60, 110, 0.5)",
                  "0 0 30px rgba(249, 115, 22, 0.5)",
                  "0 0 20px rgba(26, 60, 110, 0.5)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-blue-400">SMART</span>{" "}
              <span className="text-orange-400">FUNDI</span>
            </motion.h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="mt-2 text-sm tracking-wider"
            style={{ color: "#A0AEC0" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Your Trusted Technician Marketplace
          </motion.p>

          {/* Loading progress bar */}
          <motion.div
            className="mt-8 w-64 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(26, 60, 110, 0.3)" }}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 256 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Loading text */}
          <motion.p
            className="mt-4 text-xs"
            style={{ color: "#A0AEC0" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Loading your experience...
          </motion.p>
        </div>

        {/* Corner sparkles */}
        {isClient && [
          { top: "10%", left: "10%" },
          { top: "10%", right: "10%" },
          { bottom: "10%", left: "10%" },
          { bottom: "10%", right: "10%" },
        ].map((position, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={position}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="currentColor"
                className="text-orange-400"
              />
            </svg>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
