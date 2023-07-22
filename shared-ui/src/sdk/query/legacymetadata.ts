import { Metadata as LegacyMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {TokenRecord} from "@metaplex-foundation/mpl-token-metadata";
import { Connection, PublicKey } from "@solana/web3.js";
import { useContext, useEffect, useMemo } from "react";
import { MetadataProgramContext } from "../../anchor/metadata/MetadataProgramContext";
import { getLegacyMetadataPda, getLegacyTokenRecordPda } from "../../pdas";
import { useFetchSingleAccount } from "./singleAccountInfo";

import { RawAccount } from "@solana/spl-token";


export const decodeMetadata= (buffer: Buffer, pubkey: PublicKey) => {
  try {
    const metadata = LegacyMetadata.deserialize(buffer);
    return {
      item: metadata ? metadata[0] : null,
      pubkey,
    };
  } catch (e) {
    return {
      item: null,
      pubkey,
    };
  }
};


export const decodeTokenRecord = (buffer: Buffer, pubkey: PublicKey) => {
  try {
    const tokenRecord = TokenRecord.deserialize(buffer);
    return {
      item: tokenRecord ? tokenRecord[0] : null,
      pubkey,
    };
  } catch (e) {
    return {
      item: null,
      pubkey,
    };
  }
};

export const useLegacyTokenRecordByTokenAccount = (
  tokenAccount: {
    item: RawAccount | null,
    pubkey: PublicKey,
  },
  connection: Connection
) => {
  const program = useContext(MetadataProgramContext);

  const tokenRecordPda = useMemo(() => tokenAccount.item ? getLegacyTokenRecordPda(tokenAccount.item.mint, tokenAccount.pubkey)[0] : null, 
  [tokenAccount]);


  const q = useFetchSingleAccount(tokenRecordPda, connection);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item && tokenRecordPda
        ? decodeTokenRecord(q?.data?.item.buffer, tokenRecordPda)
        : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [tokenRecordPda, program, q.data?.item]);

  return decoded;

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
};



export const useLegacyMetadataByMintId = (
  mintId: PublicKey,
  connection: Connection
) => {
  const program = useContext(MetadataProgramContext);

  const metadataKey = useMemo(() => getLegacyMetadataPda(mintId)[0], [mintId]);



  const q = useFetchSingleAccount(metadataKey, connection);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item
        ? decodeMetadata(q?.data?.item.buffer, metadataKey)
        : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [metadataKey, program, q.data?.item]);

  return decoded;

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
};
