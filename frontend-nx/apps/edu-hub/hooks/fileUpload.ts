import { useState } from 'react';

export const useFileUploader = () => {
  const [isLoading, setIsLoading] = useState(false);

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const getFileBase64 = async (file) => {
    setIsLoading(true);
    try {
      const base64File = await convertToBase64(file);
      return base64File;
    } catch (error) {
      console.error('Error converting file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { getFileBase64, isLoading };
};
