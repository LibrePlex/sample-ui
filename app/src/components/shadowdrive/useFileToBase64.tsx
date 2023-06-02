import { useEffect, useState } from "react";

export const useFileToBase64 = (selectedImage: File | undefined) => {
  const [base64Image, setBase64Image] = useState<string>();
  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const reader = new FileReader();
      if (!selectedImage) {
        active && setBase64Image(undefined);
      } else {
        const base64 = await convertBase64(selectedImage);
        console.log({ base64 });
        active && setBase64Image(base64 as any);
      }
    })();

    return () => {
      active = false;
    };
  }, [selectedImage]);

  return base64Image;
};
