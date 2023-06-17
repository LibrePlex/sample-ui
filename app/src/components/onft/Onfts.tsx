import {
    Box,
    BoxProps,
    Button,
    Collapse,
    Heading,
    LinkBox,
    LinkOverlay,
    Text,
    useMediaQuery
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ReactNode, useState } from "react";
import { StaticOnftPanel } from "./StaticOnftPanel";



enum View {
  Static = "Static",
  Dynamic = "Dynamic",
}

const TabPanel = ({
  children,
  open,
  ...rest
}: { open: boolean; children: ReactNode } & BoxProps) => {
  return (
    <Collapse in={open}>
      <Box w={[400, 600, 800]}>
        <Box {...rest}>{children}</Box>
      </Box>
    </Collapse>
  );
};

export const Onft = () => {
  

  const [view, setView] = useState<View>(View.Static);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", height :"100%"
        
      }}
      rowGap={3}
    >
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-10 pb-5">
        Ordinals
      </h1>
      {/* {selectedPermissionKeys.size} */}
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent={'center'}
        columnGap={2}
        w={[300, 300, 800]}
      >
        <Button
          colorScheme="teal"
          variant={view === View.Static ? "solid" : "outline"}
          onClick={() => {
            setView(View.Static);
          }}
        >
          Static
        </Button>
        {/* <Button
          colorScheme="teal"
          variant={view === View.Dynamic ? "solid" : "outline"}
          onClick={() => {
            setView(View.Dynamic);
          }}
        >
          Dynamic
        </Button> */}
        
      </Box>

      <TabPanel
        open={view === View.Static}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: 'start', height :"100%"
        }}
      >
        <StaticOnftPanel />
      </TabPanel>

      
    </Box>
  );
};
