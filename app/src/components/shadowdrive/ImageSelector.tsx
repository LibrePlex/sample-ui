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
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
export const ImageSelector = ({
  selectedImage,
  setSelectedImage,
  currentImageUrl,
}: {
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
            height: "100%",
            width: "100%",
            minWidth: "300px",
            minHeight: "300px",
            maxWidth: "300px",
            maxHeight: "300px",
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
              opacity: visible ? 1 : 0,
              height: "100%",
              minWidth: "300px",
              minHeight: "300px",
              maxWidth: "300px",
              maxHeight: "300px",
              position: "absolute",
              width: "100%",
              aspectRatio: "1/1",
            }}
            src={base64Image}
          />
        ) : (
          <></>
        )}
        <Box p={1}>
          {selectedImage ? (
            <Button
              sx={{ width: "200px" }}
              onClick={() => {
                setSelectedImage(undefined);
              }}
              variant="contained"
            >
              Cancel
            </Button>
          ) : (
            <FormControl isRequired>
              <FormLabel htmlFor="writeUpFile">Image</FormLabel>
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
                  placeholder={""}
                  sx={{ cursor: "pointer" }}
                  onClick={() => inputRef?.current && inputRef.current.click()}
                  value={""}
                >
                  <Icon as={FiFile} /> Select
                </Button>
              </InputGroup>
            </FormControl>
          )}
        </Box>
      </Box>
    </>
  );
};
