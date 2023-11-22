import { ChakraProvider, PortalManager, createLocalStorageManager } from "@chakra-ui/react";
import { AppProps } from "next/app";
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
import { SquadsProgramProvider } from "@libreplex/shared-ui";
import { DefaultSeo, DefaultSeoProps } from "next-seo";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const manager = createLocalStorageManager("colormode-key");

const DEFAULT_SEO: DefaultSeoProps = {
  defaultOpenGraphImageWidth: 1200,
  defaultOpenGraphImageHeight: 630,
  title: undefined,
  defaultTitle: "LibrePlex",
  titleTemplate: "%s | LibrePlex",
  themeColor: "#6366f1",
  description:
    "LibrePlex is a community-driven open protocol that provides guaranteed fee-free metadata and digital asset standard for Solana.",
  openGraph: {
    url: "https://www.libreplex.io",
    type: "website",
    images: [{ url: "https://www.libreplex.io/og.webp" }],
    locale: "en_US",
  },
  twitter: {
    handle: "@LibrePlex",
    site: "@LibrePlex",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0, maximum-scale=1",
    },
    {
      name: "keywords",
      content: "libreplex, solana",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "android-touch-icon",
      type: "image/png",
      sizes: "192x192",
      href: "/android-chrome-192x192.png",
    },
    {
      rel: "android-touch-icon",
      type: "image/png",
      sizes: "512x512",
      href: "/android-chrome-512x512.png",
    },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "180x180",
      href: "/apple-chrome-icon.png",
    },
  ],
  canonical: "https://www.libreplex.io",
};

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const queryClient = useMemo(() => new QueryClient({}), []);
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <DefaultSeo {...DEFAULT_SEO} />

      <ChakraProvider colorModeManager={manager}>
        <QueryClientProvider client={queryClient}>
          <ContextProvider>
            <MetadataProgramProvider>
              <InscriptionsProgramProvider>
                <SquadsProgramProvider>
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
                </SquadsProgramProvider>
              </InscriptionsProgramProvider>
            </MetadataProgramProvider>
          </ContextProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
