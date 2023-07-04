"use client";

import {
  Box
} from "@chakra-ui/react";
import { Demo } from "@/components/demo/Demo";
import { InscriptionsProgramProvider, LibrePlexProgramProvider } from "shared-ui";
import { QueryClient, QueryClientProvider } from "react-query";
import { Tools } from "@/components/tools/Tools";
import { useMemo } from "react";

const DemoPage = () => {
  const queryClient = useMemo(()=>new QueryClient({}),[]);

  return (
    <QueryClientProvider client={queryClient}>
      <Box
        w={"100vw"}
        h={"100vh"}
 
        display={"flex"}
        flexDirection={"column"}
        sx={{
          alignItems: "center",
        }}
      >
        <Tools/>
      </Box>
    </QueryClientProvider>
  );
};

export default DemoPage;
