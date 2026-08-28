/**
 Kompresi & Validasi Gambar Hero Banner
 Memastikan gambar tidak melebihi 500 KB / 1 MB dan otomatis dikompresi di browser.
*/

export type CompressionResult = {
  dataUrl: string;
  sizeBytes: number;
  sizeFormatted: string;
  width: number;
  height: number;
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function compressAndValidateBannerImage(
  file: File,
  maxSizeBytes: number = 500 * 1024 // Default 500 KB limit
): Promise<CompressionResult> {
  // 1. Check file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File yang diunggah harus berupa gambar (JPG, PNG, WebP).');
  }

  // 2. Read image into HTML Image object
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak valid atau rusak.'));
      img.onload = () => {
        try {
          const maxDimension = 1920; // Full HD max width
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Gagal memproses gambar pada kanvas browser.'));
            return;
          }

          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Try compressing with decreasing quality until target size is reached
          let quality = 0.85;
          let dataUrl = canvas.toDataURL('image/webp', quality);

          // Fallback to JPEG if WebP unsupported or canvas produced fallback
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // Calculate approximate byte size of Data URL string
          let byteLength = getBase64ByteLength(dataUrl);

          // Iterate quality reduction if > maxSizeBytes
          while (byteLength > maxSizeBytes && quality > 0.4) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/webp', quality);
            byteLength = getBase64ByteLength(dataUrl);
          }

          // Validation check after compression attempts
          if (byteLength > 1024 * 1024) {
            // Strictly over 1MB
            reject(
              new Error(
                `Ukuran gambar (${formatFileSize(
                  byteLength
                )}) melebihi batas maksimal 1 MB! Silakan pilih foto dengan resolusi lebih kecil.`
              )
            );
            return;
          }

          resolve({
            dataUrl,
            sizeBytes: byteLength,
            sizeFormatted: formatFileSize(byteLength),
            width,
            height,
          });
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Gagal mengompres gambar.'));
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function getBase64ByteLength(dataUrl: string): number {
  const base64Str = dataUrl.split(',')[1] || '';
  return Math.floor((base64Str.length * 3) / 4);
}
