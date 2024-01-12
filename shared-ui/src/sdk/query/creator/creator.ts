import { LibreplexCreator } from "@libreplex/idls/lib/types/libreplex_creator";
import { BorshCoder, IdlAccounts } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useMemo } from "react";
import { useGpa } from "../gpa";
import { useFetchSingleAccount } from "../singleAccountInfo";
import { IDL } from "@libreplex/idls/lib/cjs/libreplex_metadata";
import { LibrePlexCreatorProgramContext } from "../../../anchor";

export type Creator = IdlAccounts<LibreplexCreator>["creator"];

// export type AssetUrl = IdlAccounts<LibreplexCreator>["assetUrl"];

const coder = new BorshCoder(IDL);

export const decodeCreator = (
  buffer: Buffer,
  pubkey: PublicKey
): {
  item: Creator | null;
  pubkey: PublicKey;
} => {
  let creator: Creator | null = null;
  try {
    // console.log({ buffer });
    creator = coder.accounts.decode<Creator>("creator", buffer);
  } catch (e) {
    console.log({ e });
  }
  return {
    item: creator,
    pubkey,
  };
};

export const useCreatorById = (
  groupKey: PublicKey | null,
  connection: Connection
) => {
  // do not remove

  const q = useFetchSingleAccount(groupKey, connection);

  const decoded = useMemo(() => {
    // console.log("decoding", { groupKey, decoder, q });
    try {
      const obj =
        groupKey && q?.data?.item
          ? decodeCreator(q.data.item.data, groupKey)
          : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [groupKey, q.data?.item]);
  return decoded;
};

export const useCreatorsByAuthority = (
  authority: PublicKey | null,
  connection: Connection
) => {
  const program = useContext(LibrePlexCreatorProgramContext);

  const filters = useMemo(() => {
    if (authority) {
      const filters = [
        {
          memcmp: {
            offset: 8,
            bytes: authority.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(sha256.array("account:Creator").slice(0, 8)),
          },
        },
      ];
      return filters;
    } else {
      return undefined;
    }
  }, [authority]);

  const q = useGpa(
    program.programId,
    filters,
    connection,
    [authority?.toBase58() ?? "", "creatorsByAuthority"],
    !!authority
  );

  const decoded = useMemo(
    () => ({
      ...q,
      data: q?.data?.map((item) => decodeCreator(item.item, item.pubkey)) ?? [],
    }),

    [q.data]
  );

  return decoded;
};
