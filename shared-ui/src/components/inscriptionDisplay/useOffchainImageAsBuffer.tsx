import { useCallback, useMemo } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { getImageAsBuffer } from "../../utils/getImageAsBuffer";

export const useOffchainImageAsBuffer = (offchainImageUrl: string) => {
  const fetcher = useCallback(() => offchainImageUrl ? getImageAsBuffer(offchainImageUrl) : undefined, [offchainImageUrl]);

  const key = useMemo(() => `buffer-${offchainImageUrl}`, [offchainImageUrl]);

  const q = useQuery<Buffer>(key, fetcher, {
    refetchOnMount: true,
  });

  return q;
};
