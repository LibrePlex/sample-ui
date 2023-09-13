import {
  ChakraProvider,
  PortalManager,
  createLocalStorageManager,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { FC, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  ContextProvider,
  InscriptionsProgramProvider,
  Notifications,
} from "@libreplex/shared-ui";
import {
  LibrePlexShopProgramProvider, MetadataProgramProvider
} from "shared-ui/src/anchor";
import { AppBar } from "../components/AppBar";
import { ContentContainer } from "../components/ContentContainer";
import {
  ShopOwnerProvider
} from "../components/ShopOwnerContext";
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");
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
                <MetadataProgramProvider>
                  <InscriptionsProgramProvider>
                    <LibrePlexShopProgramProvider>
                      <ContentContainer>
                        <PortalManager>
                          <Component {...pageProps} />
                        </PortalManager>
                      </ContentContainer>
                    </LibrePlexShopProgramProvider>
                  </InscriptionsProgramProvider>
                </MetadataProgramProvider>
            </div>
          </ContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
  // <Component {...pageProps} />
};

export default App;
