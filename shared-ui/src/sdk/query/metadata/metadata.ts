import { LibreplexMetadata } from '@libreplex/idls/lib/types/libreplex_metadata';
import {
  IMetadataJson,
  hydrateMetadataWithJson,
} from "./hydrateMetadataWithJson";

import { RawAccount, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { BorshCoder, IdlAccounts, Program, IdlTypes } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { MetadataProgramContext } from "../../../anchor/metadata/MetadataProgramContext";
import { useContext, useMemo, useEffect, useState } from "react";
import { useFetchSingleAccount } from "../singleAccountInfo";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { sha256 } from "js-sha256";
import { useGpa } from "../gpa";
import { getMetadataPda } from "../../../pdas";
import { useTokenAccountsByOwner } from "../tokenaccountsbyowner";
import { AttributeType, Group } from "./group";

import {
  BufferingConnection,
  IRpcObject,
  Inscription,
  getBase64FromDatabytes,
} from "@libreplex/shared-ui";
import { useMultipleMetadataById } from "./useMultipleMetadataById";
import { useMultipleGroupsById } from "./useMultipleGroupsById";
import { useMultipleInscriptionsById } from "./useMultipleInscriptionsById";

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

      // console.log({ metadataRaw });
      return {
        item: metadataRaw ?? null, //metadata ?? null,
        pubkey,
      };
    } catch (e) {
      console.log(e);
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
          ? a(q?.data?.item.buffer, metadataKey)
          : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [metadataKey, program, q.data?.item, a]);

  return decoded;

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
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

export const useMetadataByGroup = (
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
    "metadatabygroup",
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

export const useGroupedMetadataByOwner = (
  owner: PublicKey,
  connection: Connection
) => {
  const { program } = useContext(MetadataProgramContext);
  const { data: ownedMints, isFetching: isFetchingMints } =
    useTokenAccountsByOwner(owner, connection, TOKEN_2022_PROGRAM_ID);

  const tokenAccountByMint = useMemo(() => {
    const _tokenAccountByMint: {
      [mintId: string]: IRpcObject<RawAccount | null>;
    } = {};
    for (const ta of ownedMints) {
      if (ta.item?.mint.toBase58()) {
        _tokenAccountByMint[ta.item?.mint.toBase58()] = ta;
      }
    }
    return _tokenAccountByMint;
  }, [ownedMints]);

  const metadataIds = useMemo(
    () =>
      ownedMints
        .filter((item) => item.item?.mint!)
        .map((item) => getMetadataPda(program.programId, item.item!.mint!)[0]),
    [program, ownedMints]
  );

  const { data: metadata, isFetching: isFetchingMetadata } =
    useMultipleMetadataById(metadataIds, connection);

  const inscriptionIds = useMemo(
    () =>
      metadata
        .filter((item) => item.item?.asset.inscription?.accountId)
        .map((item) => item.item!.asset.inscription!.accountId),
    [metadata]
  );

  const { data: inscriptions, isFetching: fetchingInscriptions } =
    useMultipleInscriptionsById(inscriptionIds, connection);

  const inscriptionDict = useMemo(() => {
    const _inscriptiondDict: { [key: string]: IRpcObject<Inscription> } = {};
    for (const inscription of inscriptions) {
      _inscriptiondDict[inscription.pubkey.toBase58()] = inscription;
    }
    return _inscriptiondDict;
  }, [inscriptions]);

  const groupIds = useMemo(
    () =>
      [
        ...new Set(
          metadata
            .filter((item) => item.item?.group)
            .map((item) => item.item!.group!)
        ),
      ].sort((a, b) => a.toBase58().localeCompare(b.toBase58())),
    [metadata]
  );

  const { data: groups, isFetching: isFetchingGroups } = useMultipleGroupsById(
    groupIds,
    connection
  );

  const groupDict = useMemo(() => {
    const _groupDict: { [key: string]: IRpcObject<Group> } = {};
    for (const group of groups) {
      if (group.item) {
        _groupDict[group.pubkey.toBase58()] = { ...group, item: group.item! };
      }
    }
    return _groupDict;
  }, [groups]);

  const groupedMetadata = useMemo(() => {
    const _groupedMetadata: {
      group: IRpcObject<Group> | null;
      items: {
        metadata: IRpcObject<Metadata & { renderedJson?: IMetadataJson }>;
        tokenAccount: IRpcObject<RawAccount | null>;
      }[];
    }[] = [];

    for (const m of metadata) {
      if (m.item?.group) {
        const g = _groupedMetadata.find((item) =>
          item.group?.pubkey.equals(m.item!.group!)
        );

        const inscription = m.item?.asset.inscription?.accountId.toBase58()
          ? inscriptionDict[m.item?.asset.inscription?.accountId.toBase58()]
          : null;

        const base64 = inscription
          ? getBase64FromDatabytes(Buffer.from(inscription.item.dataBytes), m.item.asset.inscription?.dataType??'')
          : null;

        if( !base64 ) {
          console.log('Could not decode base64 url');
          continue;
        }

        const renderedJson = hydrateMetadataWithJson(
          m.item!,
          g?.group ?? null,
          base64
        );

        if (g) {
          g.items.push({
            ...m,
            metadata: { pubkey: m.pubkey, item: { ...m.item!, renderedJson } },
            tokenAccount: tokenAccountByMint[m.item.mint.toBase58()],
          });
        } else {
          _groupedMetadata.push({
            group: groupDict[m.item.group.toBase58()],
            items: [
              {
                ...m,
                metadata: {
                  pubkey: m.pubkey,
                  item: { ...m.item!, renderedJson },
                },
                tokenAccount: tokenAccountByMint[m.item.mint.toBase58()],
              },
            ],
          });
        }
      } else {
        const g = _groupedMetadata.find((item) => item.group === null) ?? null;


        const inscription = m.item?.asset.inscription?.accountId.toBase58()
          ? inscriptionDict[m.item?.asset.inscription?.accountId.toBase58()]
          : null;

          const base64 = inscription
          ? getBase64FromDatabytes(Buffer.from(inscription.item.dataBytes), m.item?.asset.inscription?.dataType??'')
          : null;

        if( !base64 ) {
          console.log('Could not decode base64 url');
          continue;
        }

        const renderedJson = hydrateMetadataWithJson(
          m.item!,
          g?.group ?? null,
          base64
        );
        if (m.item) {
          if (g) {
            g.items.push({
              ...m,
              metadata: {
                pubkey: m.pubkey,
                item: { ...m.item!, renderedJson },
              },
              tokenAccount: tokenAccountByMint[m.item.mint.toBase58()],
            });
          } else {
            _groupedMetadata.push({
              group: null,
              items: [
                {
                  ...m,
                  metadata: {
                    pubkey: m.pubkey,
                    item: { ...m.item!, renderedJson },
                  },
                  tokenAccount: tokenAccountByMint[m.item.mint.toBase58()],
                },
              ],
            });
          }
        }
      }
    }

    return _groupedMetadata;
  }, [metadata, groups]);

  return {
    data: groupedMetadata,
    isFetching:
      isFetchingMints ||
      isFetchingMetadata ||
      isFetchingGroups ||
      fetchingInscriptions,
  };
};
