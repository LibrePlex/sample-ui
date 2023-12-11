import {
    useInscriptionDataForRoot
} from "@libreplex/shared-ui";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { BATCH_SIZE } from "./WriteToInscriptionTransactionButton";

export const useInscriptionChunks = (root: PublicKey, dataBytes: number[]) => {
  const { data, refetch } = useInscriptionDataForRoot(root);
  return {
    refetch,
    chunks: useMemo(() => {
      const chunks: { chunk: number[]; isValid: boolean }[] = [];
      const remainingBytes = [...(data?.item?.buffer ?? [])];
      let i = 0;
      while (remainingBytes.length > 0) {
        const newChunk = dataBytes.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
        const chunk = remainingBytes.splice(0, BATCH_SIZE);
        chunks.push({
          chunk: newChunk,
          isValid: Buffer.from(chunk).compare(Buffer.from(newChunk)) === 0,
        });
      }
      ++i;
      return chunks;
    }, [data?.item?.buffer, dataBytes]),
  };
};
