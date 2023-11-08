import {
  ChakraProvider,
  PortalManager,
  createLocalStorageManager,
} from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC, useMemo, useState } from "react";
import { AppBar } from "../components/AppBar";
import { Footer } from "../components/Footer";
import {
  InscriptionsProgramProvider,
  LibrePlexLegacyInscriptionsProgramProvider,
  MetadataProgramProvider,
  Notifications,
} from "@libreplex/shared-ui";
import { ContextProvider } from "@libreplex/shared-ui";
import { ContentContainer } from "../components/ContentContainer";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const manager = createLocalStorageManager("colormode-key");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const queryClient = useMemo(() => new QueryClient({}), []);
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <>
      <Head>
        <title>LibrePlex</title>
      </Head>

      <ChakraProvider colorModeManager={manager}>
        <QueryClientProvider client={queryClient}>
          <ContextProvider>
            <MetadataProgramProvider>
              <InscriptionsProgramProvider>
                <LibrePlexLegacyInscriptionsProgramProvider>
                  <div className="flex flex-col h-screen bg-[#121212]">
                    <Notifications />

                    <AppBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
                    <ContentContainer>
                      <PortalManager>
                        <Component {...pageProps} />
                        {/* <Footer /> */}
                      </PortalManager>
                    </ContentContainer>
                  </div>
                </LibrePlexLegacyInscriptionsProgramProvider>
              </InscriptionsProgramProvider>
            </MetadataProgramProvider>
          </ContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
