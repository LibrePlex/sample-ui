import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { LibrePlexProgramContext } from "anchor/LibrePlexProgramContext";
import { useContext, useMemo } from "react";
import { Libreplex } from "types/libreplex";
import { useFetchMultiAccounts } from "./multiAccountInfo";

export type Metadata = IdlAccounts<Libreplex>["metadata"];

export const decodeMetadata =
  (program: Program<Libreplex>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);

    const metadata = coder.accounts.decode<Metadata>("metadata", buffer);

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

  const q = useFetchMultiAccounts(program, metadataKeys, connection);


  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => {
            try {
              const obj = decodeMetadata(program)(item.item, item.pubkey);
              return obj;
            } catch (e) {
              return null;
            }
          })
          .filter((item) => item) ?? [],
    }),

    [program, q]
  );

  return decoded;

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
};
