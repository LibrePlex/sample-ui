import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import { HttpClient } from "@libreplex/shared-ui";
import { IOffchainJson } from "@libreplex/shared-ui";

export const fetchOffchainMetadata = (url: string) => ({
  fetcher: async () => {
    const httpClient = new HttpClient("");

    const result = await httpClient.get<IOffchainJson>(url);

    return result.data ?? null;
  },
});

export const useFetchOffchainMetadata = (url: string) => {
  const { fetcher } = useMemo(
    () => fetchOffchainMetadata(url),
    [url]
  );

  const queryClient = useQueryClient();

  const key = useMemo(() => url ?? "dummy", [url]);

  const q = useQuery< IOffchainJson| null>(key, fetcher);

  return q;
};
