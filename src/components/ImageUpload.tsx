import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { validateImageFile, resizeImage } from "@/utils/image-utils";
import { showError, showSuccess } from "@/utils/toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label = "Imagem", className }: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      showError(error);
      return;
    }

    setUploading(true);
    try {
      const resizedImage = await resizeImage(file);
      onChange(resizedImage);
      showSuccess("Imagem carregada com sucesso!");
    } catch (err) {
      showError("Erro ao processar imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-2 space-y-3">
        {value ? (
          <div className="relative inline-block">
            <img 
              src={value} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded-md border"
              loading="lazy"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemove}
              aria-label="Remover imagem"
            >
              <X size={14} />
            </Button>
          </div>
        ) : (
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
            <ImageIcon size={32} className="text-gray-400" />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            aria-label="Selecionar arquivo de imagem"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            {uploading ? "Processando..." : "Escolher Imagem"}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500">
          Máximo 2MB • JPEG, PNG ou WebP • Redimensionado automaticamente
        </p>
      </div>
    </div>
  );
}