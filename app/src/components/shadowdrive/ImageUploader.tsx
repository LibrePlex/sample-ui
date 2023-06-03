import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  BoxProps,
  Button,
  Collapse,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { ImageSelector } from "./ImageSelector";
import { notify } from "utils/notifications";
import { ImageUploadActions } from "./ImageUploadActions";
import { useTheme } from "@emotion/react";

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
  fileId: string;
  onImageUpload?: () => any;
  afterUpdate: () => any;
} & BoxProps) => {
  const [selectedImage, setSelectedImage] = useState<File>();

  useEffect(() => {
    setSelectedImage(undefined);
  }, []);

  useEffect(() => {
    setStatus(Status.NotStarted);
  }, [selectedImage]);

  const [status, setStatus] = useState<Status>(Status.NotStarted);

  useEffect(() => {
    if (status === Status.Success) {
      setSelectedImage(undefined);
    }
  }, [status]);

  const theme = useTheme();

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  
  return (
    <Box {...rest} sx={{ position: "relative", ...rest.sx }}>
      {!selectedImage && (
        <img
          onLoadStart={()=>{
            setImageLoaded(false)
          }}
          onLoad={()=>{
            setImageLoaded(true)

          }}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1, opacity: imageLoaded? 1: 0 }}
          height={"150px"}
          width={"150px"}
          src={currentImage}
        />
      )}

      <ImageSelector
        height={"150px"}
        width={"150px"}
        currentImageUrl={""}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      ></ImageSelector>

      {status === Status.Success ? (
        <Box p={"10px"} sx={{ display: "flex", justifyContent: "center" }}>
          <Text>Uploaded</Text>
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
              fileId={fileId}
              afterUpdate={(url) => {
                // afterUpdate();
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
