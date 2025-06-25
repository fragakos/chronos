"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { type getDictionary } from "@/get-dictionary";
import { type Locale } from "@/i18n-config";

const CTASection = ({
  dictionary,
  currentLang,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  currentLang: Locale;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { landing } = dictionary;

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
    <section
      className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {landing.cta.title}
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            {landing.cta.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={cardVariants}>
            <Card className="bg-card/10 backdrop-blur-sm border-border/20">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary-foreground/80" />
                <h3 className="text-xl font-semibold mb-2">
                  {landing.cta.features.quickDailyDoses.title}
                </h3>
                <p className="text-primary-foreground/80">
                  {landing.cta.features.quickDailyDoses.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="bg-card/10 backdrop-blur-sm border-border/20">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-primary-foreground/80" />
                <h3 className="text-xl font-semibold mb-2">
                  {landing.cta.features.curatedContent.title}
                </h3>
                <p className="text-primary-foreground/80">
                  {landing.cta.features.curatedContent.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="bg-card/10 backdrop-blur-sm border-border/20">
              <CardContent className="p-6 text-center">
                <ArrowRight className="h-12 w-12 mx-auto mb-4 text-primary-foreground/80" />
                <h3 className="text-xl font-semibold mb-2">
                  {landing.cta.features.personalizedExperience.title}
                </h3>
                <p className="text-primary-foreground/80">
                  {landing.cta.features.personalizedExperience.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-8 border border-border/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              {landing.cta.finalCta.title}
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              {landing.cta.finalCta.description}
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.div variants={itemVariants}>
                <Link href={`/${currentLang}/auth/signup`}>
                  <Button
                    size="lg"
                    className="bg-card text-card-foreground hover:bg-card/90 px-8 py-3 text-lg font-semibold"
                  >
                    {landing.cta.finalCta.getStartedFree}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href={`/${currentLang}/auth/login`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border/30 text-primary-foreground hover:bg-card/10 px-8 py-3 text-lg"
                  >
                    {landing.cta.finalCta.alreadyHaveAccount}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
