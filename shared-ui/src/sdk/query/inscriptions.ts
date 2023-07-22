import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { InscriptionsProgramContext } from "../../anchor/inscriptions/InscriptionsProgramContext";
import { useContext, useMemo } from "react";
import { LibreplexInscriptions } from "../../types/libreplex_inscriptions";
import { useFetchSingleAccount } from "./singleAccountInfo";
import { IRpcObject } from "../../components";
import base64url from "base64url";

export type Inscription = {
  authority: PublicKey;
  root: PublicKey;
  size: number;
  dataBytes: number[];
};

export const getBase64FromDatabytes = (
  dataBytes: Buffer
) => {
  const base = dataBytes.toString("base64");
  console.log({base});
  const dataType = base.split("/")[0];
  const dataSubType = base.split("/")[1];
  const data = base.split("/").slice(2).join("/");
  return {dataType, url: `data:${dataType}/${dataSubType};base64,${data}==`}
};

export const decodeInscription =
  (program: Program<LibreplexInscriptions>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    const inscriptionBase = coder.accounts.decode<Inscription>(
      "inscription",
      buffer
    );

    const dataBytes= [...buffer.subarray(76)];

    const {dataType} = getBase64FromDatabytes(Buffer.from(dataBytes));


    const inscription = {
      ...inscriptionBase,
      dataBytes,
      dataType
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

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
};
