import { useContext, useEffect, useMemo } from "react";
import { fetchMultiAccounts, useFetchMultiAccounts } from "./multiAccountInfo";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "react-query";
import { BorshCoder, IdlAccounts, Program } from "@project-serum/anchor";
import { Libreplex } from "types/libreplex";
import { LibrePlexProgramContext } from "anchor/LibrePlexProgramContext";
import { IRpcObject } from "components/executor/IRpcObject";
import { sha256 } from "js-sha256";
import bs58 from "bs58";
import { useGpa } from "./gpa";

export type Collection = IdlAccounts<Libreplex>["collection"];

export const decodeCollection = (program: Program<Libreplex>) => (
  buffer: Buffer,
  pubkey: PublicKey
) => {
  const coder = new BorshCoder(program.idl);

  const collectionPermissions = coder.accounts.decode<Collection>(
    "collection",
    buffer
  );

  return {
    item: collectionPermissions ?? null,
    pubkey,
  };
};

export const useCollectionsById = (
  collectionKeys: PublicKey[],
  connection: Connection
) => {
  const { program } = useContext(LibrePlexProgramContext);

  return useFetchMultiAccounts(
    program,
    collectionKeys,
    decodeCollection(program),
    connection,
  );

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
};

export const useCollectionsByCreator = (
  creator: PublicKey | undefined,
  connection: Connection
) => {
  const { program } = useContext(LibrePlexProgramContext);

  const filters = useMemo(() => {
    if (creator) {
      const filters = [
        {
          memcmp: {
            offset: 40,
            bytes: creator.toBase58(),
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
      return null;
    }
  }, [creator]);

  const d = useMemo(()=>decodeCollection(program),[decodeCollection, program])

  return useGpa(program.programId, filters, connection, d, [
    creator?.toBase58() ?? "",
    "collection",
  ]);
};
