import { PublicKey } from "@solana/web3.js";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { HttpClient } from "@libreplex/shared-ui";
import { IWebHashAndBuffer } from "@app/pages/api/image/[mintId]/webp";
import { ClusterContext } from "@shared-ui/contexts/NetworkConfigurationProvider";
import { useQuery } from "react-query";

export const useLegacyCompressedImage = (mint: PublicKey, enabled: boolean = true) => {
  
  const { cluster } = useContext(ClusterContext);

  const fetcher = useCallback(async () => {
    const httpClient = new HttpClient("");

    const { data } = await httpClient.post<IWebHashAndBuffer>(
      `/api/image/${mint.toBase58()}/webp`,
      {
        cluster,
      }
    );
    return data;
  }, [mint, cluster]);

  const key = useMemo(() => `compressed-image-${mint?.toBase58()}`, [mint]);

  const q = useQuery<IWebHashAndBuffer | undefined>(key, fetcher, {refetchOnMount: false, enabled});

  return q;
};
