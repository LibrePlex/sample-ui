import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Collapse,
  Heading,
  Portal,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";

export const MutableInfoPanel = () => {
  const [open, setOpen] = useState<boolean>(false);

  const ref = React.useRef();

  return (
    <>
      <Button
        sx={{ zIndex: 1 }}
        onClick={() => {
          setOpen((old) => !old);
        }}
      >
        <InfoIcon />
      </Button>
      <Box
        sx={{ position: "absolute", bottom: 0, pointerEvents: "none" }}
        ref={ref}
      ></Box>
      <Portal containerRef={ref}>
        <Collapse in={open}>
          <Card sx={{height :"100%" }}>
            <Box sx={{ pb: 20, height :"100%" }}>
              <Box p={5}>
                <Heading>What is this mutable thing?</Heading>
                <Text>
                  Mutable = changeable. If you untick this box, the metadata
                  will be fixed for all eternity. This may be useful if you want
                  to link the mint to an item in permanent storage. For most
                  mints you should leave this box ticked. If you untick it, make
                  sure you spell everything correctly as there is no going back!
                </Text>
              </Box>
            </Box>
          </Card>
        </Collapse>
      </Portal>
    </>
  );
};
