import type { NextPage } from "next";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { WalletView } from "views/home/wallet";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>SPL 20 Token Launcher by Neft</title>
        <meta name="description" content="SPL 20 Token Validator" />
      </Head>
      <NextSeo
        openGraph={{
          type: "website",
          url: `https://avatars.githubusercontent.com/u/134429862?s=200&v=4`,
          title: `LibrePlex Fair Launch.`,
          description: "To manage fair launches.",
          images: [
            {
              url: "https://avatars.githubusercontent.com/u/134429862?s=200&v=4",
              width: 600,
              height: 600,
              alt: "https://www.libreplex.io",
            },
          ],
        }}
      />
      <WalletView />
    </div>
  );
};

export default Home;
