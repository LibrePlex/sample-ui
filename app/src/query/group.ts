import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { LibrePlexProgramContext } from "anchor/LibrePlexProgramContext";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useMemo } from "react";
import { Libreplex } from "types/libreplex";
import { useGpa } from "./gpa";
import { useFetchMultiAccounts } from "./multiAccountInfo";

export type Group = IdlAccounts<Libreplex>["metadataGroup"];

export const decodeGroup =
  (program: Program<Libreplex>) => (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);
    let group;
    try {
      group = coder.accounts.decode<Group>("metadataGroup", buffer);
    } catch (e) {
      group = null;
    }

    return {
      item: group,
      pubkey,
    };
  };

export const useGroupsById = (
  groupKeys: PublicKey[],
  connection: Connection
) => {
  const { program } = useContext(LibrePlexProgramContext);

  // do not remove

  const q = useFetchMultiAccounts(program, groupKeys, connection);

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

export const useGroupsByCreator = (
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
            bytes: bs58.encode(
              sha256.array("account:MetadataGroup").slice(0, 8)
            ),
          },
        },
      ];
      return filters;
    } else {
      return null;
    }
  }, [creator]);

  const d = useMemo(() => decodeGroup(program), [program]);

  return useGpa(program.programId, filters, connection, d, [
    creator?.toBase58() ?? "",
    "group",
  ]);
};
