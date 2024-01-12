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
import { IDL } from "@libreplex/idls/lib/cjs/libreplex_metadata";

export type Collection = IdlAccounts<LibreplexMetadata>["collection"];

export type CollectionInput = IdlTypes<LibreplexMetadata>["CollectionInput"];

export type PermittedSigners = IdlTypes<LibreplexMetadata>["Royalties"];

export type AttributeValue = any; //IdlTypes<LibreplexMetadata>["AttributeValue"];

export type RoyaltyShare = IdlTypes<LibreplexMetadata>["RoyaltyShare"];

export interface AttributeType {
  name: string;
  permittedValues: AttributeValue[];
  deleted: boolean;
  continuedAtIndex: number;
  continuedFromIndex: number;
}

// const coder = new BorshCoder(program.idl);
const coder = new BorshCoder(IDL);

export const decodeCollection =
  (program: Program<LibreplexMetadata>) =>
  (
    buffer: Buffer,
    pubkey: PublicKey
  ): {
    item: Collection | null;
    pubkey: PublicKey;
  } => {
    let group: Collection | null = null;
    // console.log(pubkey.toBase58());
      try {
        // console.log({ buffer });
        group = coder.accounts.decode<Collection>("collection", buffer);
      } catch (e) {
        console.log({ e });
      }
   
    // console.log({ group });
    return {
      item: group,
      pubkey,
    };
  };

export const useCollectionById = (
  groupKey: PublicKey | null,
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  // do not remove

  const q = useFetchSingleAccount(groupKey, connection);

  const decoder = useMemo(() => decodeCollection(program), [program]);

  const decoded = useMemo(() => {
    // console.log("decoding", { groupKey, decoder, q });
    try {
      const obj =
        groupKey && q?.data?.item
          ? decoder(q.data.item.data, groupKey)
          : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [groupKey, decoder, q.data?.item]);
  return decoded;
};

export const useCollectionsByAuthority = (
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
            bytes: bs58.encode(sha256.array("account:Collection").slice(0, 8)),
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

  const decoder = useMemo(() => decodeCollection(program), [decodeCollection, program]);
  const decoded = useMemo(
    () => ({
      ...q,
      data: q?.data?.map((item) => decoder(item.item, item.pubkey)) ?? [],
    }),

    [decoder, q.data]
  );

  return decoded;
};
