

import {
  MintLayout
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { useFetchSingleAccount } from "../singleAccountInfo";


export const decodeMint = (buffer: Buffer, pubkey: PublicKey) => {
  try {
    // console.log({buffer});
    const mint = MintLayout.decode(buffer);
    console.log({ mint });
    return {
      item: mint ?? null, //metadata ?? null,
      pubkey,
    };
  } catch (e) {
    // console.log(e);
    return {
      item: null,
      pubkey,
    };
  }
};

export const useMint = (
  mintId: PublicKey | null,
  connection: Connection
) => {
  const q = useFetchSingleAccount(mintId, connection);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item
        ? decodeMint(q?.data?.item.buffer, mintId)
        : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [mintId, q.data?.item]);

  return decoded;
};
