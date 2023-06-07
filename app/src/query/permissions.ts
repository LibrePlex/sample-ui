import { BorshCoder, IdlAccounts, IdlTypes, Program } from "@coral-xyz/anchor";
import { IdlTypeDefTyStruct } from "@coral-xyz/anchor/dist/cjs/idl";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Connection, PublicKey } from "@solana/web3.js";
import { LibrePlexProgramContext } from "anchor/LibrePlexProgramContext";
import { sha256 } from "js-sha256";
import { useGpa } from "query/gpa";
import { useContext, useEffect, useMemo } from "react";
import { Libreplex } from "types/libreplex";

export type Permissions =
  IdlAccounts<Libreplex>["permissions"];


export const decodePermission =
  (program: Program<Libreplex>) =>
  (
    buffer: Buffer,

    pubkey: PublicKey
  ) => {
    const coder = new BorshCoder(program.idl);
    const permissions = coder.accounts.decode<Permissions>(
      "permissions",
      buffer
    );
    
    return {
      item: permissions ?? null,
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
            offset: 9,
            bytes: publicKey.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(
              sha256.array("account:Permissions").slice(0, 8)
            ),
          },
        },
      ];
      return filters;
    } else {
      return null;
    }
  }, [publicKey]);
  const d = useMemo(
    () => decodePermission(program),
    [program]
  );
  return useGpa(program.programId, filters, connection, d, [
    publicKey?.toBase58() ?? "",
    "collectionpermissions",
  ]);
};


export const usePermissionsByReference = (
  reference: PublicKey | undefined,
  connection: Connection
) => {
  const { program } = useContext(LibrePlexProgramContext);

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
            bytes: bs58.encode(
              sha256.array("account:Permissions").slice(0, 8)
            ),
          },
        },
      ];
      return filters;
    } else {
      return null;
    }
  }, [reference]);
  const d = useMemo(
    () => decodePermission(program),
    [program]
  );
  return useGpa(program.programId, filters, connection, d, [
    reference?.toBase58() ?? "",
    "collectionpermissions",
  ]);
};
