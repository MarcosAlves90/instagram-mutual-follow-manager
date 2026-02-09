import { useEffect, useRef, useState } from 'react';
import { Users } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { UserCard } from '@/components/UserCard';
import { FollowerStatus, SelectionStatus } from '@/types/follower';

interface VirtualizedUserListProps {
  users: FollowerStatus[];
  listType: 'following' | 'followers';
  onStatusChange: (username: string, status: SelectionStatus) => void;
  emptyMessage: string;
}

const getColumnsForWidth = (width: number) => {
  if (width < 768) return 1;
  if (width < 1024) return 2;
  return 3;
};

export const VirtualizedUserList = ({
  users,
  listType,
  onStatusChange,
  emptyMessage,
}: VirtualizedUserListProps) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState(() =>
    getColumnsForWidth(typeof window === 'undefined' ? 1024 : window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => setColumns(getColumnsForWidth(window.innerWidth));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rows = Math.ceil(users.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 190,
    overscan: 6,
  });

  const items = rowVirtualizer.getVirtualItems();

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div
        ref={parentRef}
        className="h-[70vh] overflow-auto scroll-smooth"
      >
        <div
          className="relative w-full"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {items.map((virtualRow) => {
            const startIndex = virtualRow.index * columns;
            const rowUsers = users.slice(startIndex, startIndex + columns);

            return (
              <div
                key={virtualRow.key}
                ref={rowVirtualizer.measureElement}
                className={`absolute left-0 top-0 w-full grid gap-4 ${
                  columns === 1
                    ? 'grid-cols-1'
                    : columns === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                }`}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                {rowUsers.map((user) => (
                  <UserCard
                    key={user.username}
                    user={user}
                    onStatusChange={onStatusChange}
                    listType={listType}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
