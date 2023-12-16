import { IdlAccounts } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

import { useContext, useMemo } from "react";

import { LibreplexInscriptions } from "../../../anchor/libreplex_inscriptions";
import { useFetchSingleAccount } from "../singleAccountInfo";

import { toBigIntLE } from "bigint-buffer";
import { useStore } from "zustand";
import { InscriptionStoreContext } from "./InscriptionStoreContext";
import BN from "bn.js";

export const getBase64FromDatabytes = (dataBytes: Buffer, dataType: string) => {
  console.log({ dataBytes });
  const base = dataBytes.toString("base64");
  return `data:${dataType};base64,${base}`;
};

export interface InscriptionV3 {
  authority: PublicKey;
  root: PublicKey;
  inscriptionData: PublicKey;
  order: BN;
  size: number;
  contentType: string;
  encoding: string;
}

export const decodeInscriptionV3Buffer = (buffer: Buffer | undefined) => {
  // skip the first 8 bytes - discriminator. We could validate this?

  if (buffer) {
    // authority: 8
    const authority = new PublicKey(buffer.subarray(8, 40));

    // 8 + 32
    const root = new PublicKey(buffer.subarray(40, 72));

    // 8 + 32 + 32
    const inscriptionData = new PublicKey(buffer.subarray(72, 104));

    // 8 + 32 + 32 + 32
    const order = toBigIntLE(buffer.subarray(104, 112));

    // 8 + 32 + 32 + 32 + 32
    const size = Number(toBigIntLE(buffer.subarray(112, 116)));

    // 8 + 32 + 32 + 32 + 32 + 4
    const contentTypeSize = Number(toBigIntLE(buffer.subarray(116, 120)));

    const contentType = buffer.toString("utf8", 120, 120 + contentTypeSize);

    // length of the encoding string
    const encodingSize = Number(
      toBigIntLE(
        buffer.subarray(120 + contentTypeSize, 120 + contentTypeSize + 4)
      )
    );
    const encoding = buffer.toString(
      "utf8",
      120 + contentTypeSize + 4,
      120 + contentTypeSize + 4 + encodingSize
    );

    const item: InscriptionV3 = {
      authority,
      root,
      inscriptionData,
      order: new BN(Number(order)),
      size,
      contentType,
      encoding,
    };

    return item;
  }
  return null;
};

// moving to custom deserializers going forward to avoid anchor deserialization overhead
export const decodeInscriptionV3 = (
  buffer: Buffer | undefined,
  pubkey: PublicKey
) => {
  const item = decodeInscriptionV3Buffer(buffer);
  return {
    item,
    pubkey,
  };
};

export const useInscriptionV3ById = (
  inscriptionId: PublicKey | null,
  connection: Connection,
  live: boolean = false
) => {
  const q = useFetchSingleAccount(inscriptionId, connection);

  const store = useContext(InscriptionStoreContext);

  const updatedInscription = useStore(store, (s) => s.updatedInscription);

  const decoded = useMemo(() => {
    try {
      const obj = updatedInscription[inscriptionId.toBase58()]
        ? {
            pubkey: inscriptionId,
            item: updatedInscription[inscriptionId.toBase58()],
          }
        : q?.data?.item
        ? decodeInscriptionV3(q?.data?.item.buffer, inscriptionId)
        : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [inscriptionId,  q.data?.item?.buffer.length, updatedInscription]);



  return { ...q, data: decoded };
};
