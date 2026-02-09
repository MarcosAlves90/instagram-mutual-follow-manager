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
    <Card className="overflow-hidden glass-card">
      <CardContent className="p-6 md:p-7">
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Resumo</p>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-4xl font-semibold text-white">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-2xl ${bgGradient} shadow-glow`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
