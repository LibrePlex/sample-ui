import {
  Alert,
  Box,
  BoxProps,
  Button,
  Text
} from "@chakra-ui/react";
import { ResizeOrdinalTransactionButton } from "@/components/demo/metadata/ordinal/ResizeInscriptionTransactionButton";
import { IRpcObject } from "@/components/executor/IRpcObject";
import { ImageSelector } from "@/components/shadowdrive/ImageSelector";
import { Inscription } from "shared-ui";
import { useEffect, useMemo, useState } from "react";
import { WriteToInscriptionTransactionButton } from "./WriteToInscriptionTransactionButton";

enum Status {
  NotStarted,
  Uploading,
  Success,
  Error,
}

export const InscriptionUploader = ({
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

  const [base64, setBase64] = useState<string>();
  useEffect(() => {
    if (selectedImage) {
      var reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = function () {
        // console.log({ r: reader.result });
        setBase64(reader.result as string);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    } else {
      setBase64(undefined);
    }
  }, [selectedImage]);

  const [currentBase64Image, setCurrentBase64Image] = useState<string>();

  useEffect(() => {
    if (inscription) {
      const base = Buffer.from(inscription.item.dataBytes).toString("base64");
      const dataType = base.split("/")[0];
      const dataSubType = base.split("/")[1];
      const data = base.split("/").slice(2).join("/");
      setCurrentBase64Image(`data:${dataType}/${dataSubType};base64,${data}==`);
    }
  }, [inscription, inscription?.item.dataBytes]);

  const buf = useMemo(() => {
    if (base64) {
      const elems = base64.split(",");
      const prefix = base64.split(";");
      const prefixDataType = prefix[0].split(":")[1];

      return Buffer.from(`${prefixDataType}/${elems[1]}`, "base64");
      // const elems = base64.split(",");
      // return base64 ? Buffer.from(elems[elems.length - 1], "base64") : [];
    } else {
      return [];
    }
  }, [base64]);
  //  const base64 = useMemo(()=>getBase64(selectedImage),[selectedImage])

  return (
    <Box
      {...rest}
      sx={{ position: "relative", ...rest.sx }}
      display="flex"
      flexDir={"column"}
      alignItems="center"
    >
      {selectedImage && (base64 ?? currentBase64Image) && (
        <img
          style={{
            imageRendering: "pixelated",
          }}
          height="150px"
          width="150px"
          id="preview"
          src={base64 ?? currentBase64Image}
        ></img>
      )}
      {/* {currentBase64Image} */}
      {!selectedImage && (
        <ImageSelector
          height={"150px"}
          width={"150px"}
          currentImageUrl={base64 ?? currentBase64Image}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        ></ImageSelector>
      )}
      {/* {currentBase64Image} */}

      {/* {base64} */}
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
      ) : selectedImage ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* {inscription.item.dataLengthMax} */}
          {buf && inscription && buf.length !== inscription.item.size ? (
            <Box display="flex" flexDir={"column"} alignItems="center">
              <Text>
                Size {inscription.item.size.toLocaleString()} {"=>"}{" "}
                {buf.length.toLocaleString()}
              </Text>
              <Box
                width="100%"
                display={"flex"}
                flexDirection="column"
                alignItems={"center"}
              >
                {buf.length > inscription.item.size ? (
                  <Text color="#f44">
                    Cost: ~
                    {(
                      (buf.length - inscription.item.size) *
                      (0.0009048 - 0.00089784)
                    ).toFixed(4)}
                    SOL
                  </Text>
                ) : (
                  <Text color="lightgreen">
                    Reclaim ~
                    {(
                      (inscription.item.size - buf.length) *
                      (0.0009048 - 0.00089784)
                    ).toFixed(4)}{" "}
                    SOL
                  </Text>
                )}
                <ResizeOrdinalTransactionButton
                  params={{
                    size: buf.length,
                    inscription,
                  }}
                  formatting={{}}
                />
              </Box>
            </Box>
          ) : (
            <WriteToInscriptionTransactionButton
              params={{
                dataBytes: [...buf],
                inscription,
              }}
              formatting={{}}
            />
          )}
          {selectedImage && (
            <Button
              onClick={() => {
                setSelectedImage(undefined);
              }}
            >
              Clear
            </Button>
          )}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
