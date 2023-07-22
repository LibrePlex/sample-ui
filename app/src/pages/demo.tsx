"use client";

import { Box } from "@chakra-ui/react";
import { Demo } from "@/components/demo/Demo";

import { QueryClient, QueryClientProvider } from "react-query";
import { useMemo } from "react";

const DemoPage = () => {
  const queryClient = useMemo(() => new QueryClient({}), []);

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
        
                <Demo />
                
      </Box>
    </QueryClientProvider>
  );
};

export default DemoPage;
