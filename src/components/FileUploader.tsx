import { Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface FileUploaderProps {
  onFollowersUpload: (content: string) => void;
  onFollowingUpload: (content: string) => void;
  followersUploaded: boolean;
  followingUploaded: boolean;
}

export const FileUploader = ({
  onFollowersUpload,
  onFollowingUpload,
  followersUploaded,
  followingUploaded,
}: FileUploaderProps) => {
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (content: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        callback(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Importação</p>
            <h3 className="text-lg font-semibold">Envie seus arquivos do Instagram</h3>
            <p className="text-sm text-muted-foreground">
              Use os HTMLs de Seguidores e Seguindo para uma análise precisa.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="glass-chip rounded-full px-3 py-1 text-xs text-muted-foreground">
              Privado e local
            </span>
            <span className="glass-chip rounded-full px-3 py-1 text-xs text-muted-foreground">
              Sem login
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="followers"
              className="text-sm font-semibold text-foreground flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Arquivo de Seguidores
            </Label>
            <div className="relative">
              <input
                id="followers"
                type="file"
                accept=".html"
                onChange={(e) => handleFileUpload(e, onFollowersUpload)}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-xl file:border file:border-white/15
                  file:text-sm file:font-semibold
                  file:bg-white/10 file:text-foreground
                  hover:file:bg-white/15 file:transition-all
                  file:cursor-pointer cursor-pointer
                  file:shadow-elegant"
              />
              {followersUploaded && (
                <span className="mt-2 text-xs text-success flex items-center gap-1">
                  ✓ Arquivo carregado
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="following"
              className="text-sm font-semibold text-foreground flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Arquivo de Seguindo
            </Label>
            <div className="relative">
              <input
                id="following"
                type="file"
                accept=".html"
                onChange={(e) => handleFileUpload(e, onFollowingUpload)}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-xl file:border file:border-white/15
                  file:text-sm file:font-semibold
                  file:bg-white/10 file:text-foreground
                  hover:file:bg-white/15 file:transition-all
                  file:cursor-pointer cursor-pointer
                  file:shadow-elegant"
              />
              {followingUploaded && (
                <span className="mt-2 text-xs text-success flex items-center gap-1">
                  ✓ Arquivo carregado
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
