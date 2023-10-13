"use client";

import { Tools } from "../components/tools/Tools";
import { Box } from "@chakra-ui/react";
import React from "react";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const DemoPage = () => {
  

  return (
      <Box  
        w={"100vw"}
        h={"100vh"}
        display={"flex"}
        flexDirection={"column"}
        sx={{
          alignItems: "center",
        }}
      >
        <Tools />
      </Box>
    
  );
};

export default DemoPage;
