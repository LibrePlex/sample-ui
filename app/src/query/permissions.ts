import {
  BorshCoder,
  IdlAccounts,
  Program
} from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import {
  Connection,
  PublicKey
} from "@solana/web3.js";
import { LibrePlexProgramContext } from "anchor/LibrePlexProgramContext";
import { sha256 } from "js-sha256";
import { useGpa } from "query/gpa";
import { useContext, useEffect, useMemo } from "react";
import { Libreplex } from "types/libreplex";

export type CollectionPermissions =
  IdlAccounts<Libreplex>["collectionPermissions"];

export const decodeCollectionPermission = (
  buffer: Buffer,
  program: Program<Libreplex>,
  pubkey: PublicKey
) => {
  const coder = new BorshCoder(program.idl);

  const collectionPermissions = coder.accounts.decode<CollectionPermissions>(
    "collectionPermissions",
    buffer
  );

  return {
    item: collectionPermissions ?? null,
    pubkey,
  };
};

export const usePermissionsByUser = (
  publicKey: PublicKey | undefined,
  connection: Connection
) => {
  const { program } = useContext(LibrePlexProgramContext);

  useEffect(() => {
    console.log({ program });
  }, [program]);
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
            bytes: bs58.encode(
              sha256.array("account:CollectionPermissions").slice(0, 8)
            ),
          },
        },
      ];
      return filters;
    } else {
      return null;
    }
  }, [publicKey]);

  return useGpa(program, filters, connection, decodeCollectionPermission, [
    publicKey?.toBase58() ?? "",
    "collectionpermissions",
  ]);
};
