import { useContext, useEffect, useMemo } from "react";
import { fetchMultiAccounts, useFetchMultiAccounts } from "./multiAccountInfo";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "react-query";
import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Libreplex } from "types/libreplex";
import { LibrePlexProgramContext } from "anchor/LibrePlexProgramContext";
import { IRpcObject } from "components/executor/IRpcObject";
import { sha256 } from "js-sha256";
import bs58 from "bs58";
import { useGpa } from "./gpa";

export type Metadata = IdlAccounts<Libreplex>["metadata"];



export const decodeMetadata = (program: Program<Libreplex>) => (
  buffer: Buffer,
  pubkey: PublicKey
) => {
  const coder = new BorshCoder(program.idl);

  const metadata = coder.accounts.decode<Metadata>(
    "metadata",
    buffer
  );

  return {
    item: metadata ?? null,
    pubkey,
  };
};

export const useMetadataById = (
  metadataKeys: PublicKey[],
  connection: Connection
) => {
  const { program } = useContext(LibrePlexProgramContext);

  return useFetchMultiAccounts(
    program,
    metadataKeys,
    decodeMetadata(program),
    connection,
  );

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
};

export const useMetadataByCollection = (
  collection: PublicKey | undefined,
  connection: Connection
) => {
  const { program } = useContext(LibrePlexProgramContext);

  const filters = useMemo(() => {
    if (collection) {
      const filters = [
        {
          memcmp: {
            offset: 8,
            bytes: collection.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(sha256.array("account:Metadata").slice(0, 8)),
          },
        },
      ];
      return filters;
    } else {
      return null;
    }
  }, [collection]);

  const d = useMemo(()=>decodeMetadata(program),[decodeMetadata, program])

  return useGpa(program.programId, filters, connection, d, [
    collection?.toBase58() ?? "",
    "metadata-by-collection",
  ]);
};
