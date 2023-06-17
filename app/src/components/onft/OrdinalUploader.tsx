import { useEffect, useMemo, useState } from "react";
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
import { notify } from "utils/notifications";
import { useTheme } from "@emotion/react";
import { ImageSelector } from "components/shadowdrive/ImageSelector";
import { PublicKey } from "@solana/web3.js";
import { useResizedImage } from "./useResizedImage";
import { Inscription } from "query/inscriptions";
import { IRpcObject } from "components/executor/IRpcObject";
import { ResizeOrdinalTransactionButton } from "components/demo/metadata/ordinal/ResizeInscriptionTransactionButton";

enum Status {
  NotStarted,
  Uploading,
  Success,
  Error,
}

export const OrdinalUploader = ({
  inscription,
  onImageUpload,
  afterUpdate,
  ...rest
}: {
  inscription: IRpcObject<Inscription>;
  onImageUpload?: () => any;
  afterUpdate: () => any;
} & BoxProps) => {
  const [selectedImage, setSelectedImage] = useState<File>();

  // should store the ordinal decoded as base64 format
  const currentImage = useMemo(() => "https://", []);

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
  const [base64, setBase64] = useState<string>();
  useEffect(() => {
    if (selectedImage) {
      var reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = function () {
        console.log({ r: reader.result });
        setBase64(reader.result as string);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    } else {
        setBase64(undefined)
    }
  }, [selectedImage]);

  const resizedImage = useResizedImage(base64);

  const buf = useMemo(
    () => (resizedImage ? Buffer.from(resizedImage, "base64") : []),
    [resizedImage]
  );
  //  const base64 = useMemo(()=>getBase64(selectedImage),[selectedImage])

  return (
    <Box {...rest} sx={{ position: "relative", ...rest.sx }}>
      {base64 && (
        <img
          style={{
            imageRendering: "pixelated",
          }}
          height="150px"
          width="150px"
          id="preview"
          src={base64}
        ></img>
      )}

      {!selectedImage && (
        <ImageSelector
          height={"150px"}
          width={"150px"}
          currentImageUrl={""}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        ></ImageSelector>
      )}

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
          {/* {inscription.item.dataLengthMax} */}
          {buf &&
            inscription &&
            buf.length !== inscription.item.size ? (
              <>
                <ResizeOrdinalTransactionButton
                  params={{
                    size: buf.length,
                    inscriptionKey: inscription.pubkey,
                  }}
                  formatting={{}}
                />
                <Text>Current size {inscription.item.size}</Text>
                <Box>Resize to {buf.length}</Box>
              </>
            ): <>
                Size match ok - upload
            </>}
            <Button onClick={()=>{
                setSelectedImage(undefined)
            }}>Clear</Button>
          {/* {selectedImage && (
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
          )} */}
        </Box>
      )}
    </Box>
  );
};
