import {
  Alert,
  Box,
  BoxProps,
  Heading,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import { notify } from "@libreplex/shared-ui";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { ImageSelector } from "./ImageSelector";
import { ImageUploadActions } from "./ImageUploadActions";

enum Status {
  NotStarted,
  Uploading,
  Success,
  Error,
}

export const ImageUploaderInMemory = ({
  selectedImage,
  setSelectedImage,
  currentImage,
  onImageUpload,
  afterUpdate,
  ...rest
}: {
  selectedImage: File | undefined,
  setSelectedImage: Dispatch<SetStateAction<File|undefined>>,
  currentImage: string;
  onImageUpload?: () => any;
  afterUpdate?: (url: string) => any;
} & BoxProps) => {
  
  useEffect(() => {
    setSelectedImage(undefined);
  }, []);


  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <Box {...rest} sx={{ position: "relative", ...rest.sx }}>
      {!selectedImage && (
        <img
          onLoadStart={() => {
            setImageLoaded(false);
          }}
          onLoad={() => {
            setImageLoaded(true);
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            opacity: imageLoaded ? 1 : 0,
            maxHeight: 200,
            maxWidth: 200,
            overflow: "hidden",
          }}
          height={"200px"}
          width={"200px"}
          src={currentImage}
        />
      )}

      <ImageSelector
        height={"200px"}
        width={"200px"}
        currentImageUrl={""}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      ></ImageSelector>
     
    </Box>
  );
};
