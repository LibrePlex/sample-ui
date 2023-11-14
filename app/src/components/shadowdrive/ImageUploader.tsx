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
import { useEffect, useMemo, useState } from "react";
import { ImageSelector } from "./ImageSelector";
import { ImageUploadActions } from "./ImageUploadActions";

enum Status {
  NotStarted,
  Uploading,
  Success,
  Error,
}

export const ImageUploader = ({
  fileId,
  currentImage,
  onImageUpload,
  afterUpdate,
  linkedAccountId,
  ...rest
}: {
  currentImage: string;
  linkedAccountId: string;
  fileId?: string;
  onImageUpload?: () => any;
  afterUpdate?: (url: string) => any;
} & BoxProps) => {
  const [selectedImage, setSelectedImage] = useState<File>();

  useEffect(() => {
    setSelectedImage(undefined);
  }, []);

  useEffect(() => {
    setStatus(Status.NotStarted);
    console.log({ selectedImage });
  }, [selectedImage]);

  const [status, setStatus] = useState<Status>(Status.NotStarted);

  const extension = useMemo(
    () => selectedImage?.name.split(".").slice(-1).join(""),
    [selectedImage]
  );

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

      {status === Status.Success ? (
        <Box p={"10px"} sx={{ display: "flex", justifyContent: "center" }}>
          <Heading size="md">Uploaded</Heading>
        </Box>
      ) : status === Status.Error ? (
        <Alert
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          Uploaded succesfully.
        </Alert>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          {selectedImage && (
            <ImageUploadActions
              linkedAccountId={linkedAccountId}
              image={selectedImage}
              fileId={fileId ?? `.${extension}`}
              afterUpdate={(url) => {
                afterUpdate && afterUpdate(url);
                setStatus(Status.Success);
              }}
              notify={notify}
            >
              Update image
            </ImageUploadActions>
          )}
        </Box>
      )}
    </Box>
  );
};
