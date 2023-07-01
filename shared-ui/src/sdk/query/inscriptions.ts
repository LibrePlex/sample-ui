import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { InscriptionsProgramContext } from "../../anchor/InscriptionsProgramProvider";
import { useContext, useMemo } from "react";
import { Inscriptions } from "types/inscriptions";
import { useFetchSingleAccount } from "./singleAccountInfo";

export type Inscription = {
  authority: PublicKey,
  root: PublicKey,
  size: number,
  dataBytes: number[];
};

export const decodeInscription =
  (program: Program<Inscriptions>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    const inscription = {
      ...coder.accounts.decode<Inscription>("inscription", buffer),
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
  ordinalKey: PublicKey,
  connection: Connection
) => {
  const program = useContext(InscriptionsProgramContext);

  const q = useFetchSingleAccount(ordinalKey, connection);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item ? decodeInscription(program)(q?.data?.item, ordinalKey) : undefined;
      return obj;
    } catch (e) {
      return null;
    }
  }, [ordinalKey, program, q.data?.item]);

  return decoded;

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
};
