import { useEffect, useMemo, useRef, useState } from "react";
import { useFileToBase64 } from "./useFileToBase64";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Spinner,
  useTheme,
  Text
} from "@chakra-ui/react";

import { MdCancel } from "react-icons/md";
import { FiFile } from "react-icons/fi";
export const ImageSelector = ({
  selectedImage,
  setSelectedImage,
  currentImageUrl,
  width = "300px",
  height = "300px",
}: {
  width: number | string;
  height: number | string;
  currentImageUrl?: string;
  setSelectedImage: (f: File | undefined) => any;
  selectedImage: File | undefined;
}) => {
  const base64Image = useFileToBase64(selectedImage);

  const [visible, setVisible] = useState<boolean>(false);

  const finalImage = useMemo(
    () => base64Image ?? currentImageUrl,
    [base64Image, currentImageUrl]
  );

  useEffect(() => {
    setVisible(selectedImage !== undefined);
  }, [selectedImage]);

  const inputRef = useRef<any>();

  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Skeleton
          animation={0}
          sx={{
            opacity: visible ? 0 : 1,
            height,
            width,
            minWidth: width,
            minHeight: height,
            maxWidth: width,
            maxHeight: height,
          }}
          variant="rectangular"
        >
          <Spinner />
        </Skeleton>
        {finalImage ? (
          <img
            onLoad={() => {
              setVisible(true);
            }}
            onLoadStart={() => {
              setVisible(false);
            }}
            style={{
              imageRendering: "pixelated",
              padding: 0,
              opacity: visible ? 1 : 0,
              height,
              width,
              minWidth: width,
              minHeight: height,
              maxWidth: width,
              maxHeight: height,
              position: "absolute",
              aspectRatio: "1/1",
            }}
            src={finalImage}
          />
        ) : (
          <></>
        )}
        <Box display="flex">
          {selectedImage ? (
            <Box
              sx={{
                position: "absolute",
                top: 1,
                right: 1,
                borderRadius: "1000px",
                background: '#999',
                cursor: 'pointer'
              }}
              onClick={() => {
                setSelectedImage(undefined);
              }}
            >
              <MdCancel
                size={"32px"}
                style={{ color: '#fff'}}
              />
            </Box>
          ) : (
            <FormControl isRequired>
              <InputGroup>
                <input
                  type="file"
                  hidden
                  name="myImage"
                  ref={inputRef}
                  onChange={(event) => {
                    if (event.target?.files && event.target?.files.length > 0) {
                      console.log(event.target.files[0]);
                      setSelectedImage(event.target.files[0]);
                    }
                  }}
                />
                {/* <input type='file' accept={acceptedFileTypes} name={name} ref={inputRef} {...inputProps} inputRef={ref} style={{ display: 'none' }}></input> */}
                <Button
                  variant={"outline"}
                  onClick={() => inputRef?.current && inputRef.current.click()}
                >
                  <Icon color="#aaa" as={FiFile} /> <Text color="#aaa">Choose</Text>
                </Button>
              </InputGroup>
            </FormControl>
          )}
        </Box>
      </Box>
    </>
  );
};
