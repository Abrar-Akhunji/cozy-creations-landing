import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import yarnBall from "@/assets/yarn-ball.jpg";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="group h-full bg-card border-border rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2">
      <CardContent className="p-8 flex flex-col h-full">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
          {description}
        </p>

        {/* Decorative Yarn Image */}
        <div className="mt-auto">
          <img
            src={yarnBall}
            alt="Yarn ball decoration"
            className="w-full h-24 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;