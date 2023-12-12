
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { BATCH_SIZE } from "./WriteToInscriptionTransactionButton";
import { useInscriptionDataForRoot } from "@libreplex/shared-ui";


export function getChunkedData(oldData: number[], newData: number[]) {
    const chunks: { chunk: number[]; isValid: boolean; }[] = [];
    const oldDataBytes = [...(oldData ?? [])];
    let i = 0;
    
    while (oldDataBytes.length > 0) {
        const sliceLength = Math.min(oldDataBytes.length, BATCH_SIZE);
        const chunk = oldDataBytes.splice(0, sliceLength);
        const newChunk = newData.slice(i * BATCH_SIZE, i * BATCH_SIZE + sliceLength);
        chunks.push({
            chunk: newChunk,
            isValid: Buffer.from(chunk).compare(Buffer.from(newChunk)) === 0,
        });
        ++i;
    }
    while( i * BATCH_SIZE < newData.length) {
      const sliceLength = Math.min(oldDataBytes.length - i * BATCH_SIZE, BATCH_SIZE);
      const newChunk = newData.slice(i * BATCH_SIZE, i * BATCH_SIZE + sliceLength);
        chunks.push({
            chunk: newChunk,
            isValid: false
        });
        ++i;
    }
    
    return chunks;
}

export const useInscriptionChunks = (root: PublicKey, dataBytes: number[]) => {
  const { data, refetch } = useInscriptionDataForRoot(root);
  return {
    refetch,
    chunks: useMemo(() => {
      return getChunkedData(data?.item?.buffer ? [...data.item.buffer] : [], dataBytes);
    }, [data, dataBytes]),
  };
};
