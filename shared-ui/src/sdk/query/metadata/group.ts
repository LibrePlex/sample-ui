import { BorshCoder, IdlAccounts, Program, IdlTypes } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { LibrePlexProgramContext } from "../../../anchor/LibrePlexProgramContext";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useEffect, useMemo } from "react";
import { LibreplexMetadata as Libreplex } from "../../../types/libreplex_metadata";
import BN from "bn.js";
import { useGpa } from "../gpa";
import { LibreplexWithOrdinals } from "../../../anchor/getProgramInstanceMetadata";
import { useFetchSingleAccount } from "../singleAccountInfo";
// import { Royalties } from "./metadata";

export type Group = IdlAccounts<Libreplex>["group"];

export type GroupInput = IdlTypes<Libreplex>["GroupInput"];

export type PermittedSigners = IdlTypes<Libreplex>["Royalties"];

export type AttributeValue = IdlTypes<Libreplex>["AttributeValue"];


export type RoyaltyShare = IdlTypes<Libreplex>["RoyaltyShare"];


// export type TemplateConfiguration =
//   | {
//       none: null;
//       template?: never;
//     }
//   | {
//       none?: never;
//       template: {
//         name: string;
//         imageUrl: string;
//         description: string;
//       };
//     };

// interface BASE_TYPE {
//   word?: never;
//   none?: never;
//   u8?: never;
//   i8?: never;
//   u16?: never;
//   i16?: never;
//   u32?: never;
//   i32?: never;
//   u64?: never;
//   i64?: never;
// }

// // there's REALLY got to be a better way
// export type AttributeValue =
//   | (Omit<BASE_TYPE, "word"> & {
//       word: {
//         value: string;
//       };
//     })
//   | (Omit<BASE_TYPE, "none"> & {
//       none: null;
//     })
//   | (Omit<BASE_TYPE, "u8"> & {
//       u8: {
//         value: number;
//       };
//     })
//   | (Omit<BASE_TYPE, "u8"> & {
//       u8: {
//         value: number;
//       };
//     })
//   | (Omit<BASE_TYPE, "i8"> & {
//       i8: {
//         value: number;
//       };
//     })
//   | (Omit<BASE_TYPE, "u16"> & {
//       u16: {
//         value: number;
//       };
//     })
//   | (Omit<BASE_TYPE, "i16"> & {
//       i16: {
//         value: number;
//       };
//     })
//   | (Omit<BASE_TYPE, "u32"> & {
//       u32: {
//         value: number;
//       };
//     })
//   | (Omit<BASE_TYPE, "i32"> & {
//       i32: {
//         value: number;
//       };
//     })
//   | (Omit<BASE_TYPE, "i64"> & {
//       i64: {
//         value: BN;
//       };
//     })
//   | (Omit<BASE_TYPE, "u64"> & {
//       u64: {
//         value: BN;
//       };
//     });

export interface AttributeType {
  name: string;
  permittedValues: AttributeValue[];
  deleted: boolean;
  continuedAtIndex: number;
  continuedFromIndex: number;
}

// export interface Group {
//   seed: PublicKey;
//   updateAuthority: PublicKey;
//   creator: PublicKey;
//   itemCount: number;
//   name: string;
//   symbol: string;
//   url: string;
//   description: string;
//   templateConfiguration: TemplateConfiguration;
//   royalties: Group["royalties"] | null;
//   permittedSigners: PublicKey[];
//   attributeTypes: AttributeType[];
// }

export const decodeGroup =
  (program: Program<LibreplexWithOrdinals>) =>
  (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    let group: Group | null;
    try {
      group = coder.accounts.decode<Group>("group", buffer);
    } catch (e) {
      group = null;
    }

    return {
      item: group,
      pubkey,
    };
  };

export const useGroupById = (groupKey: PublicKey | null, connection: Connection) => {
  const {program} = useContext(LibrePlexProgramContext);

  // do not remove

  const q = useFetchSingleAccount(groupKey, connection);

  const decoded = useMemo(() => {
    try {
      const obj = groupKey && q?.data?.item
        ? decodeGroup(program)(q.data.item.buffer, groupKey)
        : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [groupKey, program, q.data?.item]);
  return decoded;
};

export const useGroupsByAuthority = (
  authority: PublicKey | null,
  connection: Connection
) => {
  const {program} = useContext(LibrePlexProgramContext);

  const filters = useMemo(() => {
    if (authority) {
      const filters = [
        {
          memcmp: {
            offset: 40,
            bytes: authority.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(sha256.array("account:Group").slice(0, 8)),
          },
        },
      ];
      return filters;
    } else {
      return undefined;
    }
  }, [authority]);

  const q = useGpa(program.programId, filters, connection, [
    authority?.toBase58() ?? "",
    "groupsByAuthority",
  ]);



  const createCollectionEventPromise = new Promise<any>((resolve, reject) => {
    
  })

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => decodeGroup(program)(item.item, item.pubkey))
          .filter((item) => item.item) ?? [],
    }),

    [program, q]
  );

  return decoded;
};
