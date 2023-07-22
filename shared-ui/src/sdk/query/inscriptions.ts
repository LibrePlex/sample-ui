import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { InscriptionsProgramContext } from "../../anchor/inscriptions/InscriptionsProgramContext";
import { useContext, useMemo } from "react";
import { LibreplexInscriptions } from "../../types/libreplex_inscriptions";
import { useFetchSingleAccount } from "./singleAccountInfo";
import { IRpcObject } from "../../components";

export type Inscription = {
  authority: PublicKey;
  root: PublicKey;
  size: number;
  dataBytes: number[];
};

export const getBase64FromInscription = (
  inscription: IRpcObject<Inscription>
) => {
  const base = Buffer.from(inscription.item.dataBytes).toString("base64");
  const dataType = base.split("/")[0];
  const dataSubType = base.split("/")[1];
  const data = base.split("/").slice(2).join("/");
  return `data:${dataType}/${dataSubType};base64,${data}==`;
};

export const decodeInscription =
  (program: Program<LibreplexInscriptions>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    const inscriptionBase = coder.accounts.decode<Inscription>(
      "inscription",
      buffer
    );
    // console.log({buffer})
    const inscription = {
      ...inscriptionBase,
      dataBytes: [...buffer.subarray(76)],
    };

    return {
      item: inscription ?? null,
      pubkey,
    };
  };

// export const useInscriptionsById = (
//   ordinalKeys: PublicKey[],
//   connection: Connection
// ) => {
//   const program  = useContext(OrdinalsProgramContext);

//   const q = useFetchMultiAccounts(ordinalKeys, connection);

//   useEffect(()=>{
//     console.log({q})
//   },[q])
//   const decoded = useMemo(
//     () => ({
//       ...q,
//       data:
//         q?.data
//           ?.map((item) => {
//             try {
//               const obj = decodeInscription(program)(item.item, item.pubkey);
//               return obj;
//             } catch (e) {
//               console.log(e);
//               return null;
//             }
//           })
//           .filter((item) => item) ?? [],
//     }),

//     [program, q]
//   );

//   return decoded;

//   // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
// };

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
