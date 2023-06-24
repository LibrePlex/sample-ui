import { LibreplexWithOrdinals } from "./../anchor/getProgramInstance";
import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { LibrePlexProgramContext } from "anchor/LibrePlexProgramContext";
import { useContext, useMemo, useEffect } from "react";
import { LibreplexMetadata as Libreplex } from "types/libreplex_metadata";
import { useFetchSingleAccount } from "./singleAccountInfo";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { sha256 } from "js-sha256";
import { useGpa } from "./gpa";

export type Metadata = IdlAccounts<Libreplex>["metadata"];

export const decodeMetadata =
  (program: Program<LibreplexWithOrdinals>) =>
  (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);

    try {
      const metadata = coder.accounts.decode<Metadata>("metadata", buffer);
      return {
        item: metadata ?? null,
        pubkey,
      };
    } catch (e) {
      
      return {
        item: null,
        pubkey,
      };
    }
  };

export const useMetadataById = (
  metadataKey: PublicKey,
  connection: Connection
) => {
  const program = useContext(LibrePlexProgramContext);

  const q = useFetchSingleAccount(metadataKey, connection);

  const decoded = useMemo(() => {
    try {
      const obj = decodeMetadata(program)(q.data.item, metadataKey);
      return obj;
    } catch (e) {
      return null;
    }
  }, [metadataKey, program, q.data?.item]);

  return decoded;

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
};

export const useMetadataByAuthority = (
  publicKey: PublicKey | undefined,
  connection: Connection
) => {
  const program = useContext(LibrePlexProgramContext);

  const filters = useMemo(() => {
    if (publicKey) {
      const filters = [
        {
          memcmp: {
            offset: 40,
            bytes: publicKey.toBase58(),
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
  }, [publicKey]);

  const q = useGpa(program.programId, filters, connection, [
    publicKey?.toBase58() ?? "",
    "metadatabyauthority",
  ]);

  useEffect(() => {
    console.log({ filters, connection, q });
  }, [filters, connection, q]);

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => decodeMetadata(program)(item.item, item.pubkey))
          .filter((item) => item.item) ?? [],
    }),

    [program, q]
  );

  return decoded;
};
