import type { AppProps } from "next/app";
import {
  ChakraProvider,
  PortalManager,
  createLocalStorageManager,
} from "@chakra-ui/react";
import Head from "next/head";
import {
  ContextProvider,
  InscriptionsProgramProvider,
  LibrePlexProgramProvider,
  Notifications,
} from "shared-ui";
import { FC, useMemo, useState } from "react";
import { AppBar } from "../components/AppBar";
import React from "react";
import { ContentContainer } from "../components/ContentContainer";
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");
import {QueryClient, QueryClientProvider} from "react-query"
const manager = createLocalStorageManager("colormode-key");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const queryClient = useMemo(() => new QueryClient({}), []);

  return (
    <>
      <Head>
        <title>LibrePlex</title>
      </Head>

      <ChakraProvider colorModeManager={manager}>
        <QueryClientProvider client={queryClient}>
          <ContextProvider>
            <div className="flex flex-col h-screen bg-[#121212]">
              <Notifications />
              <AppBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
              <LibrePlexProgramProvider>
                <InscriptionsProgramProvider>
                  <ContentContainer>
                    <PortalManager>
                      <Component {...pageProps} />
                    </PortalManager>
                  </ContentContainer>
                </InscriptionsProgramProvider>
              </LibrePlexProgramProvider>
            </div>
          </ContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
  // <Component {...pageProps} />
};

export default App;
