export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_WIDTH = 800;
export const MAX_HEIGHT = 600;
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato não suportado. Use JPEG, PNG ou WebP.';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'Imagem muito grande. Máximo 2MB.';
  }
  
  return null;
}

export function resizeImage(file: File, maxWidth = MAX_WIDTH, maxHeight = MAX_HEIGHT): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcular novas dimensões mantendo proporção
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Erro ao processar imagem'));
          }
        },
        'image/jpeg',
        0.8
      );
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}