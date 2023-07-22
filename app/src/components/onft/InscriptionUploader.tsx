import { Alert, Box, BoxProps, Button, Text } from "@chakra-ui/react";
import { ResizeInscriptionTransactionButton } from "@/components/demo/metadata/ordinal/ResizeInscriptionTransactionButton";
import { ImageSelector } from "@/components/shadowdrive/ImageSelector";
import {
  IRpcObject,
  Inscription,
  InscriptionStoreContext,
  InscriptionsProgramContext,
} from "shared-ui";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { WriteToInscriptionTransactionButton } from "./WriteToInscriptionTransactionButton";
import { useQueryClient } from "react-query";
import { PublicKey } from "@solana/web3.js";
import { useStore } from "zustand";

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

  const store = useContext(InscriptionStoreContext);

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
    // console.log({ selectedImage });
    if (selectedImage) {
      var reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = function () {
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

  const updatedInscriptionData = useStore(
    store,
    (s) => s.updatedInscriptionData[inscription?.pubkey.toBase58()]
  );

  useEffect(() => {
    if (inscription) {
      const base = (
        updatedInscriptionData ?? Buffer.from(inscription.item.dataBytes)
      ).toString("base64");
      const dataType = base.split("/")[0];
      const dataSubType = base.split("/")[1];
      const data = base.split("/").slice(2).join("/");
      // console.log(`data:${dataType}/${dataSubType};base64,${data}==`);
      setCurrentBase64Image(`data:${dataType}/${dataSubType};base64,${data}==`);
    }
  }, [inscription, inscription?.item.dataBytes, updatedInscriptionData]);

  const buf = useMemo(() => {
    if (base64) {
      const elems = base64.split(",");
      const prefix = base64.split(";");
      const prefixDataType = prefix[0].split(":")[1];

      const str = `${prefixDataType}/${elems[1]}`;
      // console.log(str);
      return Buffer.from(str, "base64");
      // const elems = base64.split(",");
      // return base64 ? Buffer.from(elems[elems.length - 1], "base64") : [];
    } else {
      return [];
    }
  }, [base64]);
  //  const base64 = useMemo(()=>getBase64(selectedImage),[selectedImage])

  // useEffect(() => {
  //   console.log({ currentBase64Image });
  // }, [currentBase64Image]);

  const sizes = useStore(store, (s) => s.updatedInscriptionSizes);

  const updatedSize = useStore(
    store,
    (s) => s.updatedInscriptionSizes[inscription?.pubkey.toBase58()]
  );

  let currentSize = useMemo(
    () => (updatedSize !== undefined ? updatedSize : inscription?.item.size),
    [updatedSize, inscription?.item.size]
  );

  return (
    <Box
      {...rest}
      sx={{ position: "relative", width :"100%" }}
      display="flex"
      flexDir={"column"}
      alignItems="center"
    >
      {selectedImage && (
        <Button
          variant={"solid"}
          colorScheme="teal"
          sx={{
            p: 0,
            top: 1,
            right: 1,
            position: "absolute",
          }}
          onClick={() => {
            setSelectedImage(undefined);
            // resetWriteStatus(undefined);
          }}
        >
          X
        </Button>
      )}
      {selectedImage && (base64 ?? currentBase64Image) && (
        <img
          style={{
            imageRendering: "pixelated",
            minHeight: "150px",
            minWidth: "150px",
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
          {inscription && (
            <Box display="flex" flexDir={"column"} alignItems="center">
              {/* <Text>
                Size {currentSize.toLocaleString()} {"=>"}{" "}
                {buf.length.toLocaleString()}
              </Text> */}
              <Box
                width="100%"
                display={"flex"}
                flexDirection="column"
                alignItems={"center"}
              >
                {buf.length > currentSize ? (
                  <Text p={1} color="#f44">
                    Cost: ~
                    {(
                      (buf.length - currentSize) *
                      (0.0009048 - 0.00089784)
                    ).toFixed(4)}
                    SOL
                  </Text>
                ) : buf.length < currentSize ? (
                  <Text p={1} color="lightgreen">
                    Reclaim ~
                    {(
                      (currentSize - buf.length) *
                      (0.0009048 - 0.00089784)
                    ).toFixed(4)}{" "}
                    SOL
                  </Text>
                ) : (
                  <Text p={1}>Size OK</Text>
                )}
                {currentSize !== buf.length ? (
                  <ResizeInscriptionTransactionButton
                    params={{
                      size: buf.length,
                      inscription,
                    }}
                    formatting={{}}
                  />
                ) : (
                  <WriteToInscriptionTransactionButton
                    params={{
                      dataBytes: [...buf],
                      inscription,
                    }}
                    formatting={{width :"100%"}}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
