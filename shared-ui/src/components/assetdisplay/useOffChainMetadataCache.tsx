import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { getLegacyMetadataPda } from "../../pdas";
import {
  decodeLegacyMetadata,
  useFetchSingleAccount,
  useLegacyMetadataByMintId,
  useMetadataByMintId,
  useMint,
} from "../../sdk";
import { HttpClient, HttpResponse } from "../../utils/HttpClient";
import { Mint } from "@solana/spl-token";
import { Field, TokenMetadata } from "@solana/spl-token-metadata";

export interface IOffchainJson {
  // add more fields as needed
  images: {
    square: string;
    url: string;
  };
  name: string;
}

export const getAsset = async (mint: string, url: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAsset",
      params: {
        id: mint,
      },
    }),
  });
  const { result } = await response.json();
  return result;
};

export const useOffChainMetadataCache = (mintId: PublicKey) => {
  const { connection } = useConnection();

  const mintOrToken2022Mint = useMint(mintId, connection);

  const { data: metadataAccount } = useLegacyMetadataByMintId(
    mintId,
    connection
  );

  const offchainUri = useMemo(() => {
    let nativeMetadata = (
      mintOrToken2022Mint?.item as Mint & { metadata?: TokenMetadata }
    )?.metadata;
    if (nativeMetadata) {
      return nativeMetadata.uri;
    } else {
      return metadataAccount?.item.data.uri;
      // const asset = await getAsset(mintId.toString(), connection.rpcEndpoint);

      // return asset.content.json_uri;
    }
  }, [mintOrToken2022Mint, metadataAccount]);
 
  const fetcher = useCallback(async () => {
    const httpClient = new HttpClient("");
    const res = await httpClient.get<{ image: string; name: string }>(
      offchainUri
    );
    return res;
  }, [offchainUri]);

  const q = useQuery<HttpResponse<{ image: string; name: string }>>(
    `offchaindata-${mintId?.toBase58()}-${offchainUri}`,
    fetcher,
    {
      enabled: true,
      refetchOnMount: false,
    }
  );

  const images = useMemo(() => {
    if (q.data?.data) {
      const retval: IOffchainJson = {
        images: {
          square: `https://libreplex.pinit.io/${q.data.data.image}`,
          url: q.data.data.image,
        },
        name: q.data.data.name,
      };
      return retval;
    } else {
      return undefined;
    }
  }, [q.data?.data]);

  // useEffect(() => {
  //   console.log({
  //     q,
  //     metadataObj,
  //     metadataAccount,
  //     url,
  //     mintId: mintId?.toBase58(),
  //     images,
  //   });
  // }, [q, metadataObj, metadataAccount, mintId, url]);

  return { data: images };
};
