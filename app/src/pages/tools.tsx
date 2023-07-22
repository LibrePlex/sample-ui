"use client";

import { Tools } from "@/components/tools/Tools";
import { Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const DemoPage = () => {
  const queryClient = useMemo(() => new QueryClient({}), []);

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
        <Tools />
      </Box>
    </QueryClientProvider>
  );
};

export default DemoPage;
