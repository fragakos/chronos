import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QuestionnaireCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const QuestionnaireCard = ({
  title,
  description,
  children,
}: QuestionnaireCardProps) => {
  return (
    <Card className="bg-card text-card-foreground shadow-md border border-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">{children}</CardContent>
    </Card>
  );
};
