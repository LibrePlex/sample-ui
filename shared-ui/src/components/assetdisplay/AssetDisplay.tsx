import { Box, Skeleton } from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Asset } from "../../sdk/query/metadata/metadata";
import { HttpClient } from "../../utils";
import { AssetDisplayInscription } from "./AssetDisplayInscription";
import { AssetDisplayChainRenderer } from "./AssetDisplayChainRenderer";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { NetworkConfigurationContext } from "../../contexts/NetworkConfigurationProvider";
import { useFunder } from "./useRenderedResult";

export interface IOffchainJson {
  // add more fields as needed
  image: string;
}

export const AssetDisplay = ({
  asset,
  mint,
}: {
  asset: Asset | undefined;
  mint: PublicKey;
}) => {
  const [offchainJson, setOffchainJson] = useState<IOffchainJson>();

  useEffect(() => {
    let active = true;
    (async () => {
      if (asset?.json) {
        const httpClient = new HttpClient("");
        const { data } = await httpClient.get<IOffchainJson>(asset.json.url);
        active && setOffchainJson(data);
      } else {
        active && setOffchainJson(undefined);
      }
    })();
    return () => {
      active = false;
    };
  }, [asset?.json]);

  return (
    <>
      {asset?.image ? (
        <img
          src={asset.image.url}
          style={{ aspectRatio: "1/1", width: "100%", borderRadius: 8 }}
        />
      ) : asset?.json ? (
        <img src={offchainJson?.image} />
      ) : asset?.chainRenderer ? (
        <AssetDisplayChainRenderer
          mint={mint}
          chainRendererProgramId={asset.chainRenderer.programId}
        />
      ) : asset?.inscription ? (
        <AssetDisplayInscription
          inscriptionId={asset?.inscription.accountId}
          dataType={asset.inscription.dataType}
        />
      ) : (
        <Skeleton style={{ aspectRatio: "1/1", width: "100%" }}></Skeleton>
      )}
    </>
  );
};
