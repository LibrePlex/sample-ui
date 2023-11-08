import { Image, Skeleton, Box } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { Asset } from "../../sdk/query/metadata/metadata";
import { AssetDisplayChainRenderer } from "./AssetDisplayChainRenderer";
import { AssetDisplayInscription } from "./AssetDisplayInscription";
import { useOffChainMetadataCache } from "./useOffChainMetadata";

export const AssetDisplay = ({
  asset,
  mint,
}: {
  asset: Asset | undefined;
  mint: PublicKey;
}) => {
  const { data: offchainJson, isFetching } = useOffChainMetadataCache(
    asset?.json?.url
  );

  return (
    <>
      {asset?.image ? (
        <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
          <Image
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: "20px",
              aspectRatio: "1/1",
              width: "100%",
            }}
            src={asset.image.url}
            // fallback={
            //   <Skeleton isLoaded={!isFetching}>
            //     <img
            //       src="https://img.freepik.com/premium-vector/gallery-simple-icon-vector-image-picture-sign-neumorphism-style-mobile-app-web-ui-vector-eps-10_532800-801.jpg"
            //       style={{ height: "100%", width: "100%", borderRadius: '20px' }}
            //     />
            //   </Skeleton>
            // }
          />
        </Box>
      ) : asset?.json ? (
        <img src={offchainJson?.image} />
      ) : asset?.chainRenderer ? (
        <AssetDisplayChainRenderer
          mint={mint}
          chainRendererProgramId={asset.chainRenderer.programId}
        />
      ) : asset?.inscription ? (
        <AssetDisplayInscription
          rootId={mint}
          dataType={asset.inscription.dataType}
        />
      ) : (
        <Skeleton style={{ aspectRatio: "1/1", width: "100%" }}></Skeleton>
      )}
    </>
  );
};
