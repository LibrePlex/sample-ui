import { useEffect, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  Collapse,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ImageSelector } from "./ImageSelector";
import { notify } from "utils/notifications";
import { ImageUploadActions } from "./ImageUploadActions";

export const MintImageUploader = ({
  fileId,
  onImageUpload,
  afterUpdate,
  mintId,
  ...rest
}: {
  mintId: string;
  fileId: string;
  onImageUpload?: () => any;
  afterUpdate: () => any;
} & BoxProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<File>();

  useEffect(() => {
    setSelectedImage(undefined);
  }, []);

  return (
    <Box {...rest}>
   
        <ImageSelector
          currentImageUrl={""}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        ></ImageSelector>

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
              mintId={mintId}
              image={selectedImage}
              fileId={fileId}
              afterUpdate={(url) => {
                setOpen(false);
                afterUpdate();
              }}
              notify={notify}
            >
              Update image
            </ImageUploadActions>
          )}
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
          }}
        ></Box>
    </Box>
  );
};
