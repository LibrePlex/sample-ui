import {
  ChakraProvider,
  PortalManager,
  createLocalStorageManager,
} from "@chakra-ui/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC, useState } from "react";
import { AppBar } from "../components/AppBar";
import { ContentContainer } from "../components/ContentContainer";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";
import { ContextProvider } from "shared-ui";
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const manager = createLocalStorageManager("colormode-key");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <>
      <Head>
        <title>LibrePlex</title>
      </Head>

      <ChakraProvider colorModeManager={manager}>
        <ContextProvider>
          <div className="flex flex-col h-screen bg-[#121212]">
            <Notifications />
            <AppBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
            <ContentContainer>
              <PortalManager>
                <Component {...pageProps} />
                <Footer />
              </PortalManager>
            </ContentContainer>
          </div>
        </ContextProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
