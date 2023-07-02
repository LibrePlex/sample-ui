
import type { AppProps } from 'next/app'
import {
  ChakraProvider,
  PortalManager,
  createLocalStorageManager,
} from "@chakra-ui/react";
import Head from "next/head";
import { ContentContainer, ContextProvider, Notifications } from 'shared-ui';
import {FC, useState} from "react"
import { AppBar } from 'components/AppBar';
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");
const manager = createLocalStorageManager("colormode-key");


const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
 
  
  return  <>
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
         </PortalManager>
      </ContentContainer>
    </div>
  </ContextProvider>
</ChakraProvider></>
  // <Component {...pageProps} />
}

export default App