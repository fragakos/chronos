"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Clock, BookOpen, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";
import { type getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";

const HeroSection = ({
  dictionary,
  currentLang,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  currentLang: Locale;
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const { landing } = dictionary;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/20 to-background text-foreground">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex justify-center mb-6"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-2 bg-card/10 backdrop-blur-sm rounded-full px-6 py-2 border border-border/20">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">
                {landing.hero.tagline}
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
            variants={itemVariants}
          >
            {landing.hero.title}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {landing.hero.subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <Link href={`/${currentLang}/auth/signup`}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              >
                {landing.hero.startLearning}
              </Button>
            </Link>
            <Link href={`/${currentLang}/auth/login`}>
              <Button
                size="lg"
                variant="outline"
                className="border-border/30 text-foreground hover:bg-card/10 px-8 py-3 text-lg"
              >
                {landing.hero.signIn}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            <motion.div variants={cardVariants}>
              <Card className="bg-card/10 backdrop-blur-sm border-border/20">
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">
                    {landing.hero.features.quickEfficient.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {landing.hero.features.quickEfficient.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="bg-card/10 backdrop-blur-sm border-border/20">
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">
                    {landing.hero.features.personalized.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {landing.hero.features.personalized.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="bg-card/10 backdrop-blur-sm border-border/20">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">
                    {landing.hero.features.richContent.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {landing.hero.features.richContent.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
