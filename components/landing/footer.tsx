import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <footer
      className="bg-card text-card-foreground border-t border-border"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="col-span-1 md:col-span-2"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                Facts Off
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your daily dose of historical knowledge. Discover fascinating
              facts and insights in just 10 minutes a day, tailored to your
              interests.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Perfect for busy professionals, students, and history enthusiasts
              in our fast-paced 2025 world.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/auth/signup"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/forgot-password"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot Password
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="text-foreground font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">Ancient History</span>
              </li>
              <li>
                <span className="text-muted-foreground">Medieval History</span>
              </li>
              <li>
                <span className="text-muted-foreground">Modern History</span>
              </li>
              <li>
                <span className="text-muted-foreground">Military History</span>
              </li>
              <li>
                <span className="text-muted-foreground">And 16 more...</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-muted-foreground text-sm">
            &copy; 2025 Facts Off. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-muted-foreground text-sm">Made with</span>
            <Heart className="h-4 w-4 text-destructive" />
            <span className="text-muted-foreground text-sm">
              for history lovers
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
