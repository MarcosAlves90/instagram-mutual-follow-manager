import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: 'primary' | 'accent';
}

export const StatsCard = ({ title, value, icon: Icon, gradient }: StatsCardProps) => {
  const bgGradient = gradient === 'primary' ? 'bg-gradient-primary' : 'bg-gradient-accent';

  return (
    <Card className="overflow-hidden shadow-card border-border/50 backdrop-blur-sm bg-card/95">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${bgGradient} shadow-glow`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
