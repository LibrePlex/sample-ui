import { useCallback, useMemo } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";

import { getFiletypeFromStream } from "../../utils/getFiletypeFromStream";

export const useFiletypeFromStream = (offchainImageUrl: string | undefined) => {
  const fetcher = useCallback(async () => offchainImageUrl ? getFiletypeFromStream(offchainImageUrl) : undefined, [offchainImageUrl]);

  const key = useMemo(() => `filetype-${offchainImageUrl}`, [offchainImageUrl]);

  const q = useQuery(key, fetcher, {
    refetchOnMount: true,
  });

  return q
};
