"use client";

import {
  Box
} from "@chakra-ui/react";
import { Demo } from "@/components/demo/Demo";
import { InscriptionsProgramProvider, LibrePlexProgramProvider } from "shared-ui";
import { QueryClient, QueryClientProvider } from "react-query";

const DemoPage = () => {
  const queryClient = new QueryClient({});

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
        <LibrePlexProgramProvider>
          <InscriptionsProgramProvider>
            <Demo />
          </InscriptionsProgramProvider>
        </LibrePlexProgramProvider>
      </Box>
    </QueryClientProvider>
  );
};

export default DemoPage;
