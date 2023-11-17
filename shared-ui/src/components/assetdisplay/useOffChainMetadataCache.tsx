import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { getLegacyMetadataPda } from "../../pdas";
import {
  decodeLegacyMetadata,
  useFetchSingleAccount
} from "../../sdk";
import { HttpClient, HttpResponse } from "../../utils/HttpClient";

export interface IOffchainJson {
  // add more fields as needed
  images: {
    square: string;
    url: string;
  };
  name: string;
}

export const useOffChainMetadataCache = (mintId: PublicKey) => {
  const { connection } = useConnection();

  const metadataPda = useMemo(
    () => (mintId ? getLegacyMetadataPda(mintId)[0] : undefined),
    [mintId]
  );

  const { data: metadataAccount } = useFetchSingleAccount(
    metadataPda,
    connection,
    false
  );

  const metadataObj = useMemo(() => {
    try {
      return metadataAccount
        ? decodeLegacyMetadata(metadataAccount?.item?.buffer, metadataPda)
        : null;
    } catch (e) {
      // console.log(e);
      return null;
    }
  }, [metadataPda, metadataAccount?.item?.buffer]);

  const url = useMemo(
    () => metadataObj?.item.data.uri.replace(/\0/g, "").trim(),
    [metadataObj]
  );

  const fetcher = useCallback(async () => {
    const httpClient = new HttpClient("");
    const res = await httpClient.get<{ image: string; name: string }>(url);
    return res;
  }, [url]);

  const q = useQuery<HttpResponse<{ image: string; name: string }>>(
    `offchaindata-${mintId?.toBase58()}-${url}`,
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

  useEffect(() => {
    console.log({
      q,
      metadataObj,
      metadataAccount,
      url,
      mintId: mintId?.toBase58(),
      images,
    });
  }, [q, metadataObj, metadataAccount, mintId, url]);

  return { data: images };
};
