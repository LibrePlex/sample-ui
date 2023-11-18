import { useCallback, useMemo } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { getImageAsBuffer } from "../../utils/getImageAsBuffer";

export const useOffchainImageAsBuffer = (offchainImageUrl: string | undefined) => {
  const fetcher = useCallback(async () => offchainImageUrl ? getImageAsBuffer(offchainImageUrl) : undefined, [offchainImageUrl]);

  const key = useMemo(() => `buffer-${offchainImageUrl}`, [offchainImageUrl]);

  const q = useQuery(key, fetcher, {
    refetchOnMount: true,
  });

  return {data: q.data};
};
