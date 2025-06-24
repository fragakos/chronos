"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  Crown,
  Palette,
  Zap,
  Shield,
  Users,
  Building,
  Microscope,
  TrendingUp,
  Heart,
  Sword,
  Flag,
  Map,
  Compass,
  Church,
  Hammer,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const historyCategories = [
  {
    name: "Ancient History",
    icon: Globe,
    description: "From the dawn of civilization to the fall of Rome",
  },
  {
    name: "Medieval History",
    icon: Crown,
    description: "Knights, castles, and the Middle Ages",
  },
  {
    name: "Renaissance & Early Modern",
    icon: Palette,
    description: "Art, science, and cultural rebirth",
  },
  {
    name: "Modern History",
    icon: Zap,
    description: "Industrial revolution and modern era",
  },
  {
    name: "Contemporary History",
    icon: Building,
    description: "Recent events and current affairs",
  },
  {
    name: "Military History",
    icon: Shield,
    description: "Battles, strategies, and warfare",
  },
  {
    name: "Cultural History",
    icon: Users,
    description: "Art, literature, and cultural movements",
  },
  {
    name: "Political History",
    icon: Building,
    description: "Governments, leaders, and political systems",
  },
  {
    name: "Science & Technology",
    icon: Microscope,
    description: "Scientific discoveries and innovations",
  },
  {
    name: "Economic History",
    icon: TrendingUp,
    description: "Trade, commerce, and economic systems",
  },
  {
    name: "Social History",
    icon: Heart,
    description: "Daily life, customs, and social structures",
  },
  {
    name: "World Wars",
    icon: Sword,
    description: "The great conflicts of the 20th century",
  },
  {
    name: "American History",
    icon: Flag,
    description: "The story of the United States",
  },
  {
    name: "European History",
    icon: Map,
    description: "The rich tapestry of European civilization",
  },
  {
    name: "Asian History",
    icon: Compass,
    description: "Ancient and modern Asian civilizations",
  },
  {
    name: "African History",
    icon: Globe,
    description: "The diverse history of the African continent",
  },
  {
    name: "Latin American History",
    icon: Map,
    description: "The vibrant history of Latin America",
  },
  {
    name: "Women in History",
    icon: Heart,
    description: "Remarkable women who shaped the world",
  },
  {
    name: "Religious History",
    icon: Church,
    description: "Faith, spirituality, and religious movements",
  },
  {
    name: "Archaeological Discoveries",
    icon: Hammer,
    description: "Ancient artifacts and lost civilizations",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-muted/50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Explore History Your Way
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from 20+ specialized categories to personalize your daily
            historical journey. Each category is carefully curated to provide
            fascinating insights and facts.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {historyCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div key={index} variants={cardVariants}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {category.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-card rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Perfect for Busy Lives
            </h3>
            <p className="text-muted-foreground mb-6">
              In our fast-paced 2025 world, finding time to learn can be
              challenging. Facts Off delivers bite-sized historical knowledge
              that fits perfectly into your daily routine.
            </p>
            <motion.div
              className="grid md:grid-cols-3 gap-6 text-center"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.div variants={itemVariants}>
                <div className="text-3xl font-bold text-primary mb-2">
                  10 min
                </div>
                <div className="text-muted-foreground">Daily commitment</div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="text-3xl font-bold text-primary mb-2">20+</div>
                <div className="text-muted-foreground">History categories</div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="text-3xl font-bold text-primary mb-2">365</div>
                <div className="text-muted-foreground">Days of learning</div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
