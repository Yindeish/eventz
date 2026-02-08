import { useCallback, useState } from 'react';

type UploadResult = {
  url: string;
  secureUrl: string;
  publicId: string;
};

type UploadOptions = {
  folder: string;
};

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (imageUri: string, options: UploadOptions): Promise<UploadResult> => {
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();

        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'upload.jpg',
        } as any);

        formData.append('upload_preset', '<YOUR_UPLOAD_PRESET>');
        formData.append('folder', options.folder);

        const res = await fetch(
          'https://api.cloudinary.com/v1_1/<YOUR_CLOUD_NAME>/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error?.message || 'Upload failed');
        }

        return {
          url: data.url,
          secureUrl: data.secure_url,
          publicId: data.public_id,
        };
      } catch (e: any) {
        setError(e.message ?? 'Image upload failed');
        throw e;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return {
    uploadImage,
    uploading,
    error,
  };
};
