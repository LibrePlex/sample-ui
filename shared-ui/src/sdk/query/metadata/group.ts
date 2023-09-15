import { BorshCoder, IdlAccounts, Program, IdlTypes } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { MetadataProgramContext } from "../../../anchor/metadata/MetadataProgramContext";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useEffect, useMemo } from "react";
import BN from "bn.js";
import { useGpa } from "../gpa";
import { useFetchSingleAccount } from "../singleAccountInfo";
import { LibreplexMetadata } from "@libreplex/idls/lib/types/libreplex_metadata";
// import { Royalties } from "./metadata";

export type Group = IdlAccounts<LibreplexMetadata>["group"];

export type GroupInput = IdlTypes<LibreplexMetadata>["GroupInput"];

export type PermittedSigners = IdlTypes<LibreplexMetadata>["Royalties"];

export type AttributeValue = any; //IdlTypes<LibreplexMetadata>["AttributeValue"];

export type RoyaltyShare = IdlTypes<LibreplexMetadata>["RoyaltyShare"];

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

export const decodeGroup =
  (program: Program<LibreplexMetadata>) =>
  (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    let group: Group | null;
    try {
      console.log({buffer});
      group = coder.accounts.decode<Group>("group", buffer);
    } catch (e) {
      console.log({e});
      group = null;
    }

    return {
      item: group,
      pubkey,
    };
  };

export const useGroupById = (
  groupKey: PublicKey | null,
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  // do not remove

  const q = useFetchSingleAccount(groupKey, connection);

  const decoder = useMemo(() => decodeGroup(program), [program]);

  const decoded = useMemo(() => {
    console.log("decoding", {groupKey, decoder, q});
    try {
      const obj =
        groupKey && q?.data?.item
          ? decoder(q.data.item.buffer, groupKey)
          : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [groupKey, decoder, q.data?.item]);
  return decoded;
};

export const useGroupsByAuthority = (
  authority: PublicKey | null,
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

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

  const createCollectionEventPromise = new Promise<any>(
    (resolve, reject) => {}
  );

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
