"use client";

import {
  Box
} from "@chakra-ui/react";

import { MetadataProgramProvider } from "@libreplex/shared-ui";
import { QueryClient, QueryClientProvider } from "react-query";
import { useMemo } from "react";
import { LibreScanner } from "@/components/demo/Scanner";
import React from "react";

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
