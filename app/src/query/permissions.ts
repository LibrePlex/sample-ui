import { LibreplexWithOrdinals } from './../anchor/getProgramInstance';
import { BorshCoder, IdlAccounts, IdlTypes, Program } from "@coral-xyz/anchor";
import { IdlTypeDefTyStruct } from "@coral-xyz/anchor/dist/cjs/idl";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Connection, PublicKey } from "@solana/web3.js";
import { LibrePlexProgramContext } from "anchor/LibrePlexProgramContext";
import { sha256 } from "js-sha256";
import { useGpa } from "query/gpa";
import { useContext, useEffect, useMemo } from "react";
import { Libreplex } from "types/libreplex";
import { decodeGroup } from "./group";

export type Permissions = IdlAccounts<Libreplex>["permissions"];

export const decodePermission =
  (program: Program<LibreplexWithOrdinals>) =>
  (
    buffer: Buffer,

    pubkey: PublicKey
  ) => {
    const coder = new BorshCoder(program.idl);
    try {
    const permissions = coder.accounts.decode<Permissions>(
      "permissions",
      buffer
    );

    return {
      item: permissions ?? null,
      pubkey,
    };
  } catch ( e) {
    console.log(e)
    return {
      item: null,
      pubkey,
    };
  }
  };

export const usePermissionsByUser = (
  publicKey: PublicKey | undefined,
  connection: Connection
) => {
  const program = useContext(LibrePlexProgramContext);

  const filters = useMemo(() => {
    if (publicKey) {
      const filters = [
        {
          memcmp: {
            offset: 9,
            bytes: publicKey.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(sha256.array("account:Permissions").slice(0, 8)),
          },
        },
      ];
      return filters;
    } else {
      return null;
    }
  }, [publicKey]);
  useEffect(() => {
    console.log({ filters, connection });
  }, [filters, connection]);
  const q = useGpa(program.programId, filters, connection, [
    publicKey?.toBase58() ?? "",
    "collectionpermissions",
  ]);

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => decodePermission(program)(item.item, item.pubkey))
          .filter((item) => item.item) ?? [],
    }),

    [program, q]
  );

  

  return decoded
};

export const usePermissionsByReference = (
  reference: PublicKey | undefined,
  connection: Connection
) => {
  const program  = useContext(LibrePlexProgramContext);

  useEffect(() => {
    console.log({ program });
  }, [program]);
  const filters = useMemo(() => {
    if (reference) {
      const filters = [
        {
          memcmp: {
            offset: 8 + 1 + 32,
            bytes: reference.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(sha256.array("account:Permissions").slice(0, 8)),
          },
        },
      ];
      return filters;
    } else {
      return null;
    }
  }, [reference]);
  const q = useGpa(program.programId, filters, connection, [
    reference?.toBase58() ?? "",
    "collectionpermissions",
  ]);

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => decodePermission(program)(item.item, item.pubkey))
          .filter((item) => item.item) ?? [],
    }),

    [program, q]
  );

  return decoded;
};
