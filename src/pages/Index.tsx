import { useState, useEffect } from 'react';
import { Users, UserMinus, UserPlus, TrendingDown, TrendingUp } from 'lucide-react';
import { FileUploader } from '@/components/FileUploader';
import { UserCard } from '@/components/UserCard';
import { StatsCard } from '@/components/StatsCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { parseInstagramHTML, compareFollowers } from '@/utils/parseFollowers';
import { saveSelections, loadSelections, clearSelections } from '@/utils/storage';
import { FollowerStatus } from '@/types/follower';
import { toast } from 'sonner';

const Index = () => {
  const [followersContent, setFollowersContent] = useState<string>('');
  const [followingContent, setFollowingContent] = useState<string>('');
  const [followingButNotFollowingBack, setFollowingButNotFollowingBack] = useState<
    FollowerStatus[]
  >([]);
  const [followersNotFollowingBack, setFollowersNotFollowingBack] = useState<
    FollowerStatus[]
  >([]);
  const [selections, setSelections] = useState<
    Record<string, 'remove' | 'keep' | 'neutral'>
  >({});

  useEffect(() => {
    const savedSelections = loadSelections();
    setSelections(savedSelections);
  }, []);

  useEffect(() => {
    if (followersContent && followingContent) {
      analyzeFollowers();
    }
  }, [followersContent, followingContent]);

  const analyzeFollowers = () => {
    const followers = parseInstagramHTML(followersContent);
    const following = parseInstagramHTML(followingContent);

    const comparison = compareFollowers(followers, following);

    const followingButNotBack = comparison.followingButNotFollowingBack.map((f) => ({
      username: f.username,
      profileUrl: f.profileUrl,
      date: f.date,
      status: (selections[f.username] as 'remove' | 'keep' | 'neutral') || 'neutral',
    }));

    const followersNotBack = comparison.followersNotFollowingBack.map((f) => ({
      username: f.username,
      profileUrl: f.profileUrl,
      date: f.date,
      status: (selections[f.username] as 'remove' | 'keep' | 'neutral') || 'neutral',
    }));

    setFollowingButNotFollowingBack(followingButNotBack);
    setFollowersNotFollowingBack(followersNotBack);

    toast.success('Análise concluída!', {
      description: `Encontrados ${followingButNotBack.length} usuários que você segue mas não seguem de volta.`,
    });
  };

  const handleStatusChange = (
    username: string,
    status: 'neutral' | 'remove' | 'keep'
  ) => {
    const newSelections = { ...selections, [username]: status };
    setSelections(newSelections);
    saveSelections(newSelections);

    setFollowingButNotFollowingBack((prev) =>
      prev.map((user) => (user.username === username ? { ...user, status } : user))
    );

    setFollowersNotFollowingBack((prev) =>
      prev.map((user) => (user.username === username ? { ...user, status } : user))
    );

    toast.success('Status atualizado!');
  };

  const handleClearSelections = () => {
    clearSelections();
    setSelections({});

    setFollowingButNotFollowingBack((prev) =>
      prev.map((user) => ({ ...user, status: 'neutral' as const }))
    );

    setFollowersNotFollowingBack((prev) =>
      prev.map((user) => ({ ...user, status: 'neutral' as const }))
    );

    toast.info('Todas as seleções foram limpas');
  };

  const getStatusCounts = (users: FollowerStatus[]) => {
    return {
      remove: users.filter((u) => u.status === 'remove').length,
      keep: users.filter((u) => u.status === 'keep').length,
      neutral: users.filter((u) => u.status === 'neutral').length,
    };
  };

  const followingCounts = getStatusCounts(followingButNotFollowingBack);
  const followersCounts = getStatusCounts(followersNotFollowingBack);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Análise de Seguidores
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra quem você segue mas não segue de volta e vice-versa. Gerencie suas
            conexões de forma inteligente.
          </p>
        </header>

        {/* File Uploader */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <FileUploader
            onFollowersUpload={setFollowersContent}
            onFollowingUpload={setFollowingContent}
            followersUploaded={!!followersContent}
            followingUploaded={!!followingContent}
          />
        </div>

        {/* Stats */}
        {(followingButNotFollowingBack.length > 0 ||
          followersNotFollowingBack.length > 0) && (
          <div
            className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <StatsCard
              title="Você segue (não seguem de volta)"
              value={followingButNotFollowingBack.length}
              icon={UserMinus}
              gradient="primary"
            />
            <StatsCard
              title="Te seguem (você não segue de volta)"
              value={followersNotFollowingBack.length}
              icon={UserPlus}
              gradient="accent"
            />
          </div>
        )}

        {/* Results */}
        {(followingButNotFollowingBack.length > 0 ||
          followersNotFollowingBack.length > 0) && (
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Resultados</h2>
              <Button variant="outline" onClick={handleClearSelections}>
                Limpar Seleções
              </Button>
            </div>

            <Tabs defaultValue="not-following-back" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="not-following-back" className="gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Não seguem de volta ({followingButNotFollowingBack.length})
                </TabsTrigger>
                <TabsTrigger value="you-not-following" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Você não segue de volta ({followersNotFollowingBack.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="not-following-back" className="space-y-4">
                <div className="flex gap-4 mb-4 p-4 bg-card/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive"></div>
                    <span className="text-sm">Remover: {followingCounts.remove}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success"></div>
                    <span className="text-sm">Manter: {followingCounts.keep}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-muted"></div>
                    <span className="text-sm">Neutro: {followingCounts.neutral}</span>
                  </div>
                </div>

                {followingButNotFollowingBack.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum usuário encontrado nesta categoria</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {followingButNotFollowingBack.map((user) => (
                      <UserCard
                        key={user.username}
                        user={user}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="you-not-following" className="space-y-4">
                <div className="flex gap-4 mb-4 p-4 bg-card/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive"></div>
                    <span className="text-sm">Remover: {followersCounts.remove}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success"></div>
                    <span className="text-sm">Manter: {followersCounts.keep}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-muted"></div>
                    <span className="text-sm">Neutro: {followersCounts.neutral}</span>
                  </div>
                </div>

                {followersNotFollowingBack.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum usuário encontrado nesta categoria</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {followersNotFollowingBack.map((user) => (
                      <UserCard
                        key={user.username}
                        user={user}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {followingButNotFollowingBack.length === 0 &&
          followersNotFollowingBack.length === 0 &&
          !followersContent &&
          !followingContent && (
            <div className="text-center py-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Users className="h-24 w-24 mx-auto mb-6 text-muted-foreground/50" />
              <h2 className="text-2xl font-semibold mb-3">
                Comece fazendo upload dos arquivos
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Faça upload dos arquivos HTML de seguidores e seguindo do Instagram para
                começar a análise.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Index;
