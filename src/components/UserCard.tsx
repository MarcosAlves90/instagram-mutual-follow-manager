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

export const UserCard = ({ user, onStatusChange, listType }: UserCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'remove':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'keep':
        return 'bg-success/10 text-success border-success/30';
      default:
        return 'bg-muted/50 text-muted-foreground border-border';
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
      className={`p-4 transition-all duration-300 hover:shadow-lg border-2 ${getStatusColor(
        user.status
      )}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-sm truncate">{user.username}</h3>
            <a
              href={user.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors" />
            </a>
          </div>
          <Badge variant="outline" className="text-xs">
            {getStatusLabel(user.status)}
          </Badge>
          {user.date && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {listType === 'following' ? 'Você seguiu em' : 'Seguiu você em'} {user.date}
              </span>
            </p>
          )}
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant={user.status === 'keep' ? 'default' : 'outline'}
            onClick={() => onStatusChange(user.username, 'keep')}
            className={`h-8 w-8 p-0 ${
              user.status === 'keep'
                ? 'bg-success hover:bg-success/90'
                : 'hover:bg-success/10 hover:border-success'
            }`}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={user.status === 'neutral' ? 'default' : 'outline'}
            onClick={() => onStatusChange(user.username, 'neutral')}
            className={`h-8 w-8 p-0 ${
              user.status === 'neutral'
                ? 'bg-muted hover:bg-muted/90'
                : 'hover:bg-muted hover:border-border'
            }`}
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={user.status === 'remove' ? 'destructive' : 'outline'}
            onClick={() => onStatusChange(user.username, 'remove')}
            className={`h-8 w-8 p-0 ${
              user.status === 'remove'
                ? ''
                : 'hover:bg-destructive/10 hover:border-destructive'
            }`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
