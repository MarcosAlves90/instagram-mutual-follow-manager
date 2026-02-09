import { Users, UserMinus, UserPlus, TrendingDown, TrendingUp } from 'lucide-react';
import { FileUploader } from '@/components/FileUploader';
import { StatsCard } from '@/components/StatsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useFollowerAnalysis } from '@/hooks/useFollowerAnalysis';
import { VirtualizedUserList } from '@/components/VirtualizedUserList';

const Index = () => {
  const {
    followersContent,
    followingContent,
    setFollowersContent,
    setFollowingContent,
    followingButNotFollowingBack,
    followersNotFollowingBack,
    followingCounts,
    followersCounts,
    handleStatusChange,
    handleClearSelections,
  } = useFollowerAnalysis();

  return (
    <div className="min-h-screen app-shell relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-10 right-0 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 py-10 max-w-7xl relative">

        <header className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="Self IG Mutual Manager"
              className="h-10 w-10 rounded-2xl shadow-glow object-cover"
              loading="eager"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Self IG</p>
              <h1 className="text-lg font-semibold">Mutual Manager</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="glass-chip rounded-full px-4 py-2 text-xs text-muted-foreground">
              100% local • sem login
            </span>
          </div>
        </header>

        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center mb-14">
          <div className="space-y-6">
            <div className="hero-badge glass-chip">
              Black Glass Edition
            </div>
            <h2 className="hero-title">
              Domine seus seguidores com
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                clareza e estilo
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Veja rapidamente quem não retribui, quem ainda não foi seguido de volta e
              mantenha sua lista organizada com decisões inteligentes.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="glass-chip rounded-full px-4 py-2 text-xs text-muted-foreground">
                Análise instantânea
              </span>
              <span className="glass-chip rounded-full px-4 py-2 text-xs text-muted-foreground">
                Decisões marcadas
              </span>
              <span className="glass-chip rounded-full px-4 py-2 text-xs text-muted-foreground">
                Zero rastreamento
              </span>
            </div>
          </div>
          <div className="glass-strong rounded-3xl p-6 md:p-8 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Visão geral</p>
              <h3 className="text-2xl font-semibold">Tudo em um único painel</h3>
              <p className="text-sm text-muted-foreground">
                Faça upload dos arquivos e visualize seus resultados com um layout limpo e
                elegante.
              </p>
            </div>
            <div className="glow-divider" />
            <div className="grid gap-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Seguidores analisados</span>
                <span className="text-white">Automático</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Controle de ações</span>
                <span className="text-white">Manter / Remover</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Histórico de seleção</span>
                <span className="text-white">Salvo localmente</span>
              </div>
            </div>
          </div>
        </section>

        {/* File Uploader */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <FileUploader
            onFollowersUpload={setFollowersContent}
            onFollowingUpload={setFollowingContent}
            followersUploaded={!!followersContent}
            followingUploaded={!!followingContent}
          />
        </div>

        <section className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            {
              title: '1. Faça o download dos dados',
              description: 'No Instagram, exporte os HTMLs de seguidores e seguindo.',
            },
            {
              title: '2. Envie os arquivos',
              description: 'Arraste ou selecione os arquivos para iniciar a leitura.',
            },
            {
              title: '3. Tome decisões',
              description: 'Marque quem manter, remover ou deixar neutro.',
            },
          ].map((step) => (
            <div key={step.title} className="glass-panel rounded-2xl p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white">{step.title}</h4>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </section>

        {/* Stats */}
        {(followingButNotFollowingBack.length > 0 ||
          followersNotFollowingBack.length > 0) && (
          <div
            className="grid md:grid-cols-2 gap-6 mb-10 animate-fade-in"
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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h2 className="section-title">Resultados</h2>
                <p className="section-subtitle">Organize quem entra e quem sai do seu radar.</p>
              </div>
              <Button
                variant="outline"
                onClick={handleClearSelections}
                className="glass-chip border-white/10 hover:border-white/25"
              >
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
                <div className="flex flex-wrap gap-4 mb-4 p-4 glass-panel rounded-lg">
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

                <VirtualizedUserList
                  users={followingButNotFollowingBack}
                  listType="following"
                  onStatusChange={handleStatusChange}
                  emptyMessage="Nenhum usuário encontrado nesta categoria"
                />
              </TabsContent>

              <TabsContent value="you-not-following" className="space-y-4">
                <div className="flex flex-wrap gap-4 mb-4 p-4 glass-panel rounded-lg">
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

                <VirtualizedUserList
                  users={followersNotFollowingBack}
                  listType="followers"
                  onStatusChange={handleStatusChange}
                  emptyMessage="Nenhum usuário encontrado nesta categoria"
                />
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
              <div className="glass-panel rounded-2xl px-6 py-10 inline-flex flex-col items-center">
                <Users className="h-24 w-24 mx-auto mb-6 text-muted-foreground/60" />
                <h2 className="text-2xl font-semibold mb-3">
                  Comece fazendo upload dos arquivos
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Faça upload dos arquivos HTML de seguidores e seguindo do Instagram para
                  começar a análise.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Index;
