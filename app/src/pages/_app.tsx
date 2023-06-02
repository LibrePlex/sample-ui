import { AppProps } from "next/app";
import Head from "next/head";
import { FC, useState } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { ContentContainer } from "../components/ContentContainer";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";
import { LibrePlexProgramProvider } from "anchor/LibrePlexProgramContext";
import { PortalManager } from "@chakra-ui/react";
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {

  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <>
      <Head>
        <title>LibrePlex</title>
      </Head>

      <ContextProvider>
        <div className="flex flex-col h-screen">
          <Notifications />
          <AppBar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen}/>
          <ContentContainer>
            <PortalManager>
            
              <Component {...pageProps} />
              <Footer />
              </PortalManager>
              
          </ContentContainer>
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
