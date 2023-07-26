"use client";

import {
  Box
} from "@chakra-ui/react";
import { Demo } from "@/components/demo/Demo";
import { MetadataProgramProvider } from "shared-ui";
import { QueryClient, QueryClientProvider } from "react-query";
import { useMemo } from "react";
import { LibreScanner } from "@/components/demo/Scanner";

const DemoPage = () => {
  const queryClient = useMemo(()=>new QueryClient({}),[]);

  return (
    <QueryClientProvider client={queryClient}>
      <Box
        w={"100vw"}
        h={"100%"}
        display={"flex"}
        flexDirection={"column"}
        sx={{
          alignItems: "center",
        }}
      >
        <MetadataProgramProvider>
            <LibreScanner />
        </MetadataProgramProvider>
      </Box>
    </QueryClientProvider>
  );
};

export default DemoPage;
