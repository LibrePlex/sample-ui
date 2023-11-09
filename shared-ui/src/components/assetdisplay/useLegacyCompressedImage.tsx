import { PublicKey } from "@solana/web3.js";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { HttpClient } from "../..";

import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";
import { useQuery } from "react-query";


export interface IWebHashAndBuffer {
  buf: number[];
  hash: string;
}

export const getLegacyCompressedImage = async (mint: PublicKey, cluster: string) => {
  const httpClient = new HttpClient("");

    const { data } = await httpClient.post<IWebHashAndBuffer>(
      `/api/image/${mint.toBase58()}/webp`,
      {
        cluster,
      }
    );
    return data;
}


export const useLegacyCompressedImage = (mint: PublicKey, enabled: boolean = true) => {
  
  const { cluster } = useContext(ClusterContext);

  const fetcher = useCallback(async () => {
    return getLegacyCompressedImage(mint, cluster)
  }, [mint, cluster]);

  const key = useMemo(() => `compressed-image-${mint?.toBase58()}`, [mint]);

  const q = useQuery<IWebHashAndBuffer | undefined>(key, fetcher, {refetchOnMount: false, enabled});

  return q;
};
