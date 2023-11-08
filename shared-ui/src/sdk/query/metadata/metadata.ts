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
import { useTokenAccountsByOwner } from "../tokenaccountsbyowner";
import { Collection } from "./collection";

import { useMultipleMetadataById } from "./useMultipleMetadataById";
import { useMultipleCollectionsById } from "./useMultipleCollectionsById";
import { useMultipleInscriptionsById } from "./useMultipleInscriptionsById";
import {
  Inscription,
  getBase64FromDatabytes,
} from "../inscriptions/inscriptions";
import { decode } from "bs58";
import { useMultipleAccountsById } from "./useMultipleAccountsById";

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
          ? a(q?.data?.item.buffer, metadataKey)
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

export const useMetadataGroupedByCollection = (
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

  // useEffect(()=>{
  //   console.log({metadataIds})
  // },[metadataIds])

  const { data: metadata, isFetching: isFetchingMetadata } =
    useMultipleMetadataById(metadataIds, connection);

  const inscriptionIds = useMemo(
    () =>
      metadata
        .filter((item) => item.item?.asset.inscription?.accountId)
        .map((item) => item.item!.asset.inscription!.accountId),
    [metadata]
  );

  const inscriptionDataIds = useMemo(
    () =>
      metadata
        .filter((item) => item.item?.asset.inscription?.accountId)
        .map((item) => getInscriptionPda(item.item!.mint)[0]),
    [metadata]
  );

  const { data: inscriptionData, isFetching: isFetchingInscriptionData } =
    useMultipleAccountsById(inscriptionDataIds, connection);

  const { data: inscriptions, isFetching: fetchingInscriptions } =
    useMultipleInscriptionsById(inscriptionIds, connection);

  const inscriptionDict = useMemo(() => {
    const _inscriptiondDict: { [key: string]: IRpcObject<Inscription> } = {};
    for (const inscription of inscriptions) {
      _inscriptiondDict[inscription.pubkey.toBase58()] = inscription;
    }
    return _inscriptiondDict;
  }, [inscriptions]);


  const inscriptionDataDict = useMemo(() => {
    const _inscriptionDataDict: { [key: string]: {
      accountId: PublicKey;
      data: Buffer;
      balance: bigint;
  } } = {};
    for (const dataItem of inscriptionData) {
      _inscriptionDataDict[dataItem.accountId.toBase58()] = dataItem;
    }
    return _inscriptionDataDict;
  }, [inscriptionData]);


  const groupIds = useMemo(
    () =>
      [
        ...new Set(
          metadata
            .filter((item) => item.item?.collection)
            .map((item) => item.item!.collection!)
        ),
      ].sort((a, b) => a.toBase58().localeCompare(b.toBase58())),
    [metadata]
  );

  const { data: collections, isFetching: isFetchingGroups } =
    useMultipleCollectionsById(groupIds, connection);

  // useEffect(()=>{
  //   console.log({metadata, groups, groupIds})
  // },[metadata, groups, groupIds])
  const collectionDict = useMemo(() => {
    const _groupDict: { [key: string]: IRpcObject<Collection> } = {};
    for (const group of collections) {
      if (group.item) {
        _groupDict[group.pubkey.toBase58()] = { ...group, item: group.item! };
      }
    }
    return _groupDict;
  }, [collections]);

  const groupedMetadata = useMemo(() => {
    const _groupedMetadata: {
      collection: IRpcObject<Collection> | null;
      items: {
        metadata: IRpcObject<Metadata & { renderedJson?: IMetadataJson }>;
        tokenAccount: IRpcObject<RawAccount | null>;
      }[];
    }[] = [];
    // console.log({metadata});
    for (const m of metadata) {
      // console.log({m})
      if (m.item?.collection) {
        const g = _groupedMetadata.find((item) =>
          item.collection?.pubkey.equals(m.item!.collection!)
        );

        const inscription = m.item?.asset.inscription?.accountId.toBase58()
          ? inscriptionDict[m.item?.asset.inscription?.accountId.toBase58()]
          : null;

        const base64 = inscription
          ? getBase64FromDatabytes(
              inscriptionDataDict[inscription.item.root.toBase58()].data,
              m.item.asset.inscription?.dataType ?? ""
            )
          : null;

        if (!base64) {
          console.log("Could not decode base64 url");
        }

        const renderedJson = hydrateMetadataWithJson(
          m.item!,
          g?.collection ?? null,
          base64
        );
        console.log({ g });
        // if metadata has a collection specified but collection has not been loaded yet, do nothing
        if (!collectionDict[m.item.collection.toBase58()]) {
          continue;
        }
        if (g) {
          g.items.push({
            ...m,
            metadata: { pubkey: m.pubkey, item: { ...m.item!, renderedJson } },
            tokenAccount: tokenAccountByMint[m.item.mint.toBase58()],
          });
        } else {
          _groupedMetadata.push({
            collection: collectionDict[m.item.collection.toBase58()],
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
        const g =
          _groupedMetadata.find((item) => item.collection === null) ?? null;

        const inscription = m.item?.asset.inscription?.accountId.toBase58()
          ? inscriptionDict[m.item?.asset.inscription?.accountId.toBase58()]
          : null;

        const base64 = inscription
          ? getBase64FromDatabytes(
            inscriptionDataDict[inscription.item.root.toBase58()].data,
              m.item?.asset.inscription?.dataType ?? ""
            )
          : null;

        if (!base64) {
          console.log("Could not decode base64 url");
        }

        const renderedJson = hydrateMetadataWithJson(
          m.item!,
          g?.collection ?? null,
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
              collection: null,
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
  }, [metadata, collectionDict, inscriptionDataDict]);

  return {
    data: groupedMetadata,
    isFetching:
      isFetchingMints ||
      isFetchingMetadata ||
      isFetchingGroups ||
      fetchingInscriptions,
  };
};
