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
    <Card className="shadow-card border-border/50 backdrop-blur-sm bg-card/95">
      <CardContent className="p-6">
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
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gradient-primary file:text-primary-foreground
                  hover:file:opacity-90 file:transition-all
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
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gradient-accent file:text-accent-foreground
                  hover:file:opacity-90 file:transition-all
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
