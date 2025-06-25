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
import { type getDictionary } from "@/get-dictionary";

const FeaturesSection = ({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { landing } = dictionary;

  const historyCategories = [
    {
      key: "ancientHistory",
      icon: Globe,
      name: landing.features.categories.ancientHistory.name,
      description: landing.features.categories.ancientHistory.description,
    },
    {
      key: "medievalHistory",
      icon: Crown,
      name: landing.features.categories.medievalHistory.name,
      description: landing.features.categories.medievalHistory.description,
    },
    {
      key: "renaissanceEarlyModern",
      icon: Palette,
      name: landing.features.categories.renaissanceEarlyModern.name,
      description:
        landing.features.categories.renaissanceEarlyModern.description,
    },
    {
      key: "modernHistory",
      icon: Zap,
      name: landing.features.categories.modernHistory.name,
      description: landing.features.categories.modernHistory.description,
    },
    {
      key: "contemporaryHistory",
      icon: Building,
      name: landing.features.categories.contemporaryHistory.name,
      description: landing.features.categories.contemporaryHistory.description,
    },
    {
      key: "militaryHistory",
      icon: Shield,
      name: landing.features.categories.militaryHistory.name,
      description: landing.features.categories.militaryHistory.description,
    },
    {
      key: "culturalHistory",
      icon: Users,
      name: landing.features.categories.culturalHistory.name,
      description: landing.features.categories.culturalHistory.description,
    },
    {
      key: "politicalHistory",
      icon: Building,
      name: landing.features.categories.politicalHistory.name,
      description: landing.features.categories.politicalHistory.description,
    },
    {
      key: "scienceTechnology",
      icon: Microscope,
      name: landing.features.categories.scienceTechnology.name,
      description: landing.features.categories.scienceTechnology.description,
    },
    {
      key: "economicHistory",
      icon: TrendingUp,
      name: landing.features.categories.economicHistory.name,
      description: landing.features.categories.economicHistory.description,
    },
    {
      key: "socialHistory",
      icon: Heart,
      name: landing.features.categories.socialHistory.name,
      description: landing.features.categories.socialHistory.description,
    },
    {
      key: "worldWars",
      icon: Sword,
      name: landing.features.categories.worldWars.name,
      description: landing.features.categories.worldWars.description,
    },
    {
      key: "americanHistory",
      icon: Flag,
      name: landing.features.categories.americanHistory.name,
      description: landing.features.categories.americanHistory.description,
    },
    {
      key: "europeanHistory",
      icon: Map,
      name: landing.features.categories.europeanHistory.name,
      description: landing.features.categories.europeanHistory.description,
    },
    {
      key: "asianHistory",
      icon: Compass,
      name: landing.features.categories.asianHistory.name,
      description: landing.features.categories.asianHistory.description,
    },
    {
      key: "africanHistory",
      icon: Globe,
      name: landing.features.categories.africanHistory.name,
      description: landing.features.categories.africanHistory.description,
    },
    {
      key: "latinAmericanHistory",
      icon: Map,
      name: landing.features.categories.latinAmericanHistory.name,
      description: landing.features.categories.latinAmericanHistory.description,
    },
    {
      key: "womenInHistory",
      icon: Heart,
      name: landing.features.categories.womenInHistory.name,
      description: landing.features.categories.womenInHistory.description,
    },
    {
      key: "religiousHistory",
      icon: Church,
      name: landing.features.categories.religiousHistory.name,
      description: landing.features.categories.religiousHistory.description,
    },
    {
      key: "archaeologicalDiscoveries",
      icon: Hammer,
      name: landing.features.categories.archaeologicalDiscoveries.name,
      description:
        landing.features.categories.archaeologicalDiscoveries.description,
    },
  ];

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
            {landing.features.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {landing.features.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {historyCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.div key={category.key} variants={cardVariants}>
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
              {landing.features.perfectForBusyLives.title}
            </h3>
            <p className="text-muted-foreground mb-6">
              {landing.features.perfectForBusyLives.description}
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
                <div className="text-muted-foreground">
                  {landing.features.perfectForBusyLives.stats.dailyCommitment}
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="text-3xl font-bold text-primary mb-2">20+</div>
                <div className="text-muted-foreground">
                  {landing.features.perfectForBusyLives.stats.historyCategories}
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="text-3xl font-bold text-primary mb-2">365</div>
                <div className="text-muted-foreground">
                  {landing.features.perfectForBusyLives.stats.daysOfLearning}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
