import { useContext, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import { HttpClient } from "../../utils/HttpClient";
import { PublicKey } from "@solana/web3.js";
import { ClusterContext } from "../../contexts/NetworkConfigurationProvider";

export interface IOffchainJson {
  // add more fields as needed
  images: {
    square: string,
    url: string
  },
  name: string
}


export const fetchOffchainMetadataCache = (mintId: PublicKey, cluster?: string) => ({
  fetcher: async () => {
    const httpClient = new HttpClient("");

    const result = await httpClient.get<IOffchainJson>(`https://images.neft.world/api/images/v5/${mintId.toBase58()}${cluster==='devnet'?'/devnet':''}`);

    return result.data ?? null;
  },
});

export const useOffChainMetadataCache = (mintId: PublicKey) => {

  const {cluster} = useContext(ClusterContext);
  const { fetcher } = useMemo(
    () => fetchOffchainMetadataCache(mintId, cluster),
    [mintId, cluster]
  );

  const key = useMemo(() => `offchaindata-${mintId?.toBase58()}` ?? "dummy", [mintId]);

  const q = useQuery< IOffchainJson| null>(key, fetcher, {refetchOnMount: false, enabled: !!mintId});

  return q;
};
