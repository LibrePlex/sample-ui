"use client";

import { Box } from "@chakra-ui/react";
import { Demo } from "../components/demo/Demo";

import { QueryClient, QueryClientProvider } from "react-query";
import { useMemo } from "react";
import React from "react";

const DemoPage = () => {
  
  return (
      <Box
        w={"100vw"}
        h={"100%"}
        display={"flex"}
        flexDirection={"column"}
        sx={{
          alignItems: "center",
        }}
      >
        
                <Demo />
                
      </Box>
  
  );
};

export default DemoPage;
