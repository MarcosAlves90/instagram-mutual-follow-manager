import { memo } from 'react';
import { ExternalLink, X, Check, Circle, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FollowerStatus } from '@/types/follower';

interface UserCardProps {
  user: FollowerStatus;
  onStatusChange: (username: string, status: 'neutral' | 'remove' | 'keep') => void;
  listType: 'following' | 'followers';
}

const UserCardBase = ({ user, onStatusChange, listType }: UserCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'remove':
        return 'border-destructive/40 text-destructive shadow-[0_0_25px_hsl(0_72%_52%_/_0.25)]';
      case 'keep':
        return 'border-success/40 text-success shadow-[0_0_25px_hsl(142_71%_45%_/_0.25)]';
      default:
        return 'border-white/10 text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'remove':
        return 'Remover';
      case 'keep':
        return 'Manter';
      default:
        return 'Neutro';
    }
  };

  return (
    <Card
      className={`p-4 glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(0,0,0,0.6)] border ${getStatusColor(
        user.status
      )}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate text-white">{user.username}</h3>
              <p className="text-xs text-muted-foreground">Perfil do Instagram</p>
            </div>
            <a
              href={user.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 glass-chip rounded-full p-2 hover:border-white/30 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-white transition-colors" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs glass-chip rounded-full px-3 py-1 border-white/10">
              {getStatusLabel(user.status)}
            </Badge>
            {user.date && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {listType === 'following' ? 'Você seguiu em' : 'Seguiu você em'} {user.date}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant={user.status === 'keep' ? 'default' : 'outline'}
            onClick={() => onStatusChange(user.username, 'keep')}
            className={`h-9 w-9 p-0 rounded-full ${
              user.status === 'keep'
                ? 'bg-success hover:bg-success/90 text-white'
                : 'glass-chip hover:border-success/50'
            }`}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={user.status === 'neutral' ? 'default' : 'outline'}
            onClick={() => onStatusChange(user.username, 'neutral')}
            className={`h-9 w-9 p-0 rounded-full ${
              user.status === 'neutral'
                ? 'bg-muted hover:bg-muted/90 text-white'
                : 'glass-chip hover:border-white/30'
            }`}
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={user.status === 'remove' ? 'destructive' : 'outline'}
            onClick={() => onStatusChange(user.username, 'remove')}
            className={`h-9 w-9 p-0 rounded-full ${
              user.status === 'remove'
                ? 'text-white'
                : 'glass-chip hover:border-destructive/50'
            }`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const UserCard = memo(UserCardBase);
UserCard.displayName = 'UserCard';
