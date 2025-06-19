import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

const StarWarsButton: React.FC<{
  label: string;
  link: string;
  className?: string;
}> = ({ label, link, className = "" }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const controls = useAnimation();

  useEffect(() => {
    const generateStars = () => {
      if (buttonRef.current) {
        const { width, height } = buttonRef.current.getBoundingClientRect();
        setStars(
          Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 50 + 20,
          }))
        );
      }
    };

    generateStars();
    window.addEventListener("resize", generateStars);
    return () => window.removeEventListener("resize", generateStars);
  }, []);

  return (
    <Link href={link} className="w-full sm:w-auto">
      <motion.button
        ref={buttonRef}
        className={`text-md relative overflow-hidden rounded-full border-2 border-primary bg-background px-8 py-2.5 font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto transition-colors hover:bg-primary hover:text-primary-foreground ${className}`}
        animate={controls}
        whileTap={{ scale: 0.95 }}
        whileHover={{
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        }}
      >
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-primary/60"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
            }}
            animate={{
              x: `-${star.speed}%`,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
        <span className="relative z-10">{label}</span>
      </motion.button>
    </Link>
  );
};

export default StarWarsButton;
