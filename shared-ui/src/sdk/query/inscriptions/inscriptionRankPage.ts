import { PublicKey } from "@solana/web3.js";
import { toBigIntLE } from "bigint-buffer";

export const decodeInscriptionRankPage = (
  buffer: Buffer,
  pubkey: PublicKey,
  startRank: number,
  endRank: number
) => {
  let size: bigint = BigInt(0);
  const inscriptionKeys: PublicKey[] = [];
  console.log({buffer, startRank, endRank});
  if (buffer && buffer.length > 12) {
    size = toBigIntLE(Buffer.from([...buffer].slice(8, 12)))
    let remainingBytes =
      buffer && buffer.length > 12
        ? [...buffer].slice(8 + 4 + startRank * 32, 8 + 4 + endRank * 32)
        : [];

    while (remainingBytes.length > 31) {
      let nextChunk = remainingBytes.splice(0, 32);
      console.log({nextChunk});
      inscriptionKeys.push(new PublicKey(nextChunk));
    }
  }
  return {
    item: {
      size,
      inscriptionKeys,
    },
    pubkey,
  };
};
