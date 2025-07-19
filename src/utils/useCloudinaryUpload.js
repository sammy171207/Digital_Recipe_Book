import { useState } from 'react';

export function useCloudinaryUpload(uploadPreset) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');

  const upload = async (file) => {
    setUploading(true);
    setError('');
    setUrl('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dflmcqecg/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setUrl(data.secure_url);
        setUploading(false);
        return data.secure_url;
      } else {
        setError('Upload failed.');
        setUploading(false);
        return null;
      }
    } catch (err) {
      setError('Upload failed.');
      setUploading(false);
      return null;
    }
  };

  return { upload, uploading, error, url };
}
