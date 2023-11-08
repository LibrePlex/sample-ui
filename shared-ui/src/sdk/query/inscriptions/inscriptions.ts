import { IdlAccounts } from "@coral-xyz/anchor";
import { BorshCoder, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

import { useContext, useEffect, useMemo } from "react";

import { LibreplexInscriptions } from "../../../anchor/libreplex_inscriptions";
import { useFetchSingleAccount } from "../singleAccountInfo";
import { InscriptionsProgramContext } from "./InscriptionsProgramContext";
import { InscriptionStoreContext } from "./InscriptionStoreContext";
import { useStore } from "zustand";

export type Inscription = IdlAccounts<LibreplexInscriptions>["inscription"];

export const getBase64FromDatabytes = (dataBytes: Buffer, dataType: string) => {
  console.log({ dataBytes });
  const base = dataBytes.toString("base64");
  return `data:${dataType};base64,${base}`;
};

export const decodeInscription =
  (program: Program<LibreplexInscriptions>) =>
  (buffer: Buffer | undefined, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    const inscription = buffer
      ? coder.accounts.decode<Inscription>("inscription", buffer)
      : null;

    return {
      item: inscription,
      pubkey,
    };
  };

export const useInscriptionById = (
  inscriptionId: PublicKey | null,
  connection: Connection
) => {
  const program = useContext(InscriptionsProgramContext);
  const store = useContext(InscriptionStoreContext);

  const q = useFetchSingleAccount(inscriptionId, connection, false);

  // const updatedInscriptionSizes = useStore(
  //   store,
  //   (s) => s.updatedInscriptionSizes
  // );

  const updatedInscription = useStore(store, (s) => s.updatedInscription);

  const decoded = useMemo(() => {
    try {
      const obj = updatedInscription[inscriptionId.toBase58()]
        ? {
            pubkey: inscriptionId,
            item: updatedInscription[inscriptionId.toBase58()],
          }
        : q?.data?.item
        ? decodeInscription(program)(q?.data?.item.buffer, inscriptionId)
        : undefined;
      return obj;
    } catch (e) {
      return null;
    }
  }, [inscriptionId, program, q.data?.item?.buffer.length, updatedInscription]);

  // useEffect(()=>{
  //   console.log({updatedInscriptionSizes})
  // },[updatedInscriptionSizes])

  // const decodedAndUpdated = useMemo(
  //   () =>
  //     decoded
  //       ? {
  //           ...decoded,
  //           item: {
  //             ...decoded.item,
  //           },
  //         }
  //       : null,
  //   [updatedInscriptionSizes, decoded, inscriptionId]
  // );

  return {
    data: decoded,
    refetch: q.refetch,
    isFetching: q.isFetching,
  };
};
