import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { LibrePlexProgramContext } from "anchor/LibrePlexProgramContext";
import bs58 from "bs58";
import { IRpcObject } from "components/executor/IRpcObject";
import { sha256 } from "js-sha256";
import { useContext, useMemo } from "react";
import { Libreplex } from "types/libreplex";
import { useGpa } from "./gpa";
import { Metadata, useMetadataById } from "./metadata";
import { useFetchMultiAccounts } from "./multiAccountInfo";

export type MetadataExtended = IdlAccounts<Libreplex>["metadataExtended"];

export const decodeMetadataExtended =
  (program: Program<Libreplex>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);

    const metadata = coder.accounts.decode<MetadataExtended>(
      "metadataExtended",
      buffer
    );

    return {
      item: metadata ?? null,
      pubkey,
    };
  };



export const useMetadataExtendedByGroup = (
  group: PublicKey | undefined,
  connection: Connection
) => {
  const { program } = useContext(LibrePlexProgramContext);

  const filters = useMemo(() => {
    if (group) {
      const filters = [
        {
          memcmp: {
            offset: 8,
            bytes: group.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(
              sha256.array("account:MetadataExtended").slice(0, 8)
            ),
          },
        },
      ];
      return filters;
    } else {
      return null;
    }
  }, [group]);

  const d = useMemo(() => decodeMetadataExtended(program), [program]);

  const { data: metadataExtended, isFetching } = useGpa(
    program.programId,
    filters,
    connection,
    d,
    [group?.toBase58() ?? "", `metadataextended-by-group`]
  );

  const distinctMetadataKeys = useMemo(
    () => metadataExtended?.map((item) => item.item.metadata)??[],
    [metadataExtended]
  );

  const { data: metadata, isFetching: isFetchingMetadata } = useMetadataById(
    distinctMetadataKeys,
    connection
  );

  const metadataDict = useMemo(() => {
    const _metadataDict: { [key: string]: IRpcObject<Metadata> } = {};
    for (const m of metadata) {
      _metadataDict[m.pubkey.toBase58()] = m;
    }
    return _metadataDict;
  }, [metadata]);

  const hydrated = useMemo(
    () =>
      metadataExtended?.map((item) => ({
          extended: item,
          metadata: metadataDict[item.item.metadata.toBase58()],
        }))
        .filter((item) => item.metadata)??[],
    [metadataExtended, metadataDict]
  );

  return { hydrated, isFetching: isFetching || isFetchingMetadata };
};


export const useMetadataExtendedById = (
  metadataExtendedKeys: PublicKey[],
  connection: Connection
) => {
  const { program } = useContext(LibrePlexProgramContext);

  const q = useFetchMultiAccounts(
    program,
    metadataExtendedKeys,
    connection
  );

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => {
            try {
              const obj = decodeMetadataExtended(program)(item.item, item.pubkey);
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