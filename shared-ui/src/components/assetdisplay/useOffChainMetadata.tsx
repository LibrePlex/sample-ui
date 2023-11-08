import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import { HttpClient } from "../../utils/HttpClient";

export interface IOffchainJson {
  // add more fields as needed
  image: string;
}


export const fetchOffchainMetadata = (url: string) => ({
  fetcher: async () => {
    const httpClient = new HttpClient("");

    const result = await httpClient.get<IOffchainJson>(url);

    return result.data ?? null;
  },
});

export const useOffChainMetadataCache = (url: string) => {
  const { fetcher } = useMemo(
    () => fetchOffchainMetadata(url),
    [url]
  );

  const key = useMemo(() => url ?? "dummy", [url]);

  const q = useQuery< IOffchainJson| null>(key, fetcher, {refetchOnMount: false});

  return q;
};
