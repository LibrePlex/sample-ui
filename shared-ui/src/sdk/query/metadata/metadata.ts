import { getInscriptionPda } from "@libreplex/shared-ui";
import { IRpcObject } from "./../../../components/executor/IRpcObject";

import { LibreplexMetadata } from "@libreplex/idls/lib/types/libreplex_metadata";
import {
  IMetadataJson,
  hydrateMetadataWithJson,
} from "./hydrateMetadataWithJson";

import { RawAccount, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { BorshCoder, IdlAccounts, Program, IdlTypes } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { MetadataProgramContext } from "../../../anchor/metadata/MetadataProgramContext";
import { useContext, useMemo } from "react";
import { useFetchSingleAccount } from "../singleAccountInfo";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { sha256 } from "js-sha256";
import { useGpa } from "../gpa";
import { getMetadataPda } from "../../../pdas";

export enum AssetType {
  None,
  Json,
  JsonTemplate,
  Image,
  ChainRenderer,
  Inscription,
  Unknown,
}

export type Asset = IdlTypes<LibreplexMetadata>["Asset"];

export type Metadata = IdlAccounts<LibreplexMetadata>["metadata"];

export const decodeMetadata =
  (program: Program<LibreplexMetadata>) =>
  (buffer: Buffer, pubkey: PublicKey) => {
    try {
      const coder = new BorshCoder(program.idl);
      // console.log({buffer});
      const metadataRaw = coder.accounts.decode<Metadata>("metadata", buffer);

      console.log({ metadataRaw });
      return {
        item: metadataRaw ?? null, //metadata ?? null,
        pubkey,
      };
    } catch (e) {
      // console.log(e);
      return {
        item: null,
        pubkey,
      };
    }
  };

export const useMetadataByMintId = (
  mintId: PublicKey | null,
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  const metadataId = useMemo(
    () =>
      mintId && program ? getMetadataPda(program.programId, mintId)[0] : null,
    [mintId, program.programId]
  );

  return useMetadataById(metadataId, connection);
};

export const useMetadataById = (
  metadataKey: PublicKey | null,
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  const q = useFetchSingleAccount(metadataKey, connection);

  const a = useMemo(() => decodeMetadata(program), [program]);

  const decoded = useMemo(() => {
    try {
      const obj =
        q?.data?.item && metadataKey
          ? a(q?.data?.item.data, metadataKey)
          : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [metadataKey, program, q.data?.item, a]);

  return decoded;
};

export const useMetadataByAuthority = (
  publicKey: PublicKey | undefined,
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  const filters = useMemo(() => {
    if (publicKey) {
      const filters = [
        {
          memcmp: {
            offset: 72,
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
      return undefined;
    }
  }, [publicKey]);

  const q = useGpa(program.programId, filters, connection, [
    publicKey?.toBase58() ?? "",
    "metadatabyauthority",
  ]);

  // useEffect(() => {
  //   console.log({ filters, connection, q });
  // }, [filters, connection, q]);

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

export const useMetadataByCollection = (
  publicKey: PublicKey | undefined,
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);

  const filters = useMemo(() => {
    if (publicKey) {
      const filters = [
        {
          memcmp: {
            offset: 8 + 32 + 32 + 32 + 1 + 1,
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
      return undefined;
    }
  }, [publicKey]);

  const q = useGpa(program.programId, filters, connection, [
    publicKey?.toBase58() ?? "",
    "metadatabycollection",
  ]);

  // useEffect(() => {
  //   console.log({ filters, connection, q });
  // }, [filters, connection, q]);

  const decoder = useMemo(
    () => decodeMetadata(program),
    [program, decodeMetadata]
  );

  const decoded = useMemo(
    () => ({
      ...q,
      data:
        q?.data
          ?.map((item) => decoder(item.item, item.pubkey))
          .filter((item) => item.item) ?? [],
    }),

    [q?.data, decoder]
  );

  return decoded;
};

