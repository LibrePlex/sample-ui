import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

import { useContext, useMemo } from "react";
import { LibreplexInscriptions } from "../../../types/libreplex_inscriptions";
import { useFetchSingleAccount } from "../singleAccountInfo";
import { IRpcObject } from "../../../components";
import base64url from "base64url";
import { InscriptionsProgramContext } from "./InscriptionsProgramContext";

export type Inscription = {
  authority: PublicKey;
  root: PublicKey;
  size: number;
  dataBytes: number[];
};


export const getBase64FromDatabytes = (
  dataBytes: Buffer,
  dataType: string,
) => {
  console.log({dataBytes})
  const base = dataBytes.toString("base64");
  return `data:${dataType};base64,${base}`
};

export const decodeInscription =
  (program: Program<LibreplexInscriptions>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    const inscriptionBase = coder.accounts.decode<Inscription>(
      "inscription",
      buffer
    );

    const dataBytes= [...buffer.subarray(76)];


    const inscription = {
      ...inscriptionBase,
      dataBytes,
    };

    return {
      item: inscription ?? null,
      pubkey,
    };
  };

export const useInscriptionById = (
  inscriptionId: PublicKey,
  connection: Connection
) => {
  const program = useContext(InscriptionsProgramContext);

  const q = useFetchSingleAccount(inscriptionId, connection, false);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item
        ? decodeInscription(program)(q?.data?.item.buffer, inscriptionId)
        : undefined;
      return obj;
    } catch (e) {
      return null;
    }
  }, [inscriptionId, program, q.data?.item?.buffer.length]);

  return decoded;
};
