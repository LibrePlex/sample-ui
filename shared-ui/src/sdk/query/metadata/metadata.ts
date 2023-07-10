import { LibreplexWithOrdinals } from "../../../anchor/getProgramInstanceMetadata";
import { BorshCoder, IdlAccounts, Program, IdlTypes } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { LibrePlexProgramContext } from "../../../anchor/LibrePlexProgramContext";
import { useContext, useMemo, useEffect } from "react";
import { LibreplexMetadata as Libreplex } from "../../../types/libreplex_metadata";
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

export type Asset = IdlTypes<LibreplexWithOrdinals>["Asset"];

/// there's gotta be a better way!

// export type Asset =
//   | {
//       none: null;
//       json?: never;
//       jsonTemplate?: never;
//       image?: never;
//       chainRenderer?: never;
//       inscription?: never;
//     }
//   | {
//       json: {
//         url: string;
//       };
//       none?: never;
//       jsonTemplate?: never;
//       image?: never;
//       chainRenderer?: never;
//       inscription?: never;
//     }
//   | {
//       jsonTemplate: {
//         urlParameter: string;
//       };
//       none?: never;
//       json?: never;
//       image?: never;
//       chainRenderer?: never;
//       inscription?: never;
//     }
//   | {
//       image: {
//         url: string;
//       };
//       none?: never;
//       json?: never;
//       jsonTemplate?: never;
//       chainRenderer?: never;
//       inscription?: never;
//     }
//   | {
//       chainRenderer: {
//         programId: PublicKey;
//       };
//       none?: never;
//       json?: never;
//       jsonTemplate?: never;
//       image?: never;
//       inscription?: never;
//     }
//   | {
//       inscription: {
//         accountId: PublicKey;
//       };
//       none?: never;
//       json?: never;
//       jsonTemplate?: never;
//       image?: never;
//       chainRenderer?: never;
//     }
//   | {
//       unknown: null;
//       none?: never;
//       json?: never;
//       jsonTemplate?: never;
//       image?: never;
//       chainRenderer?: never;
//       inscription?: never;
//     };

// export enum MetadataExtensionType {
//   None,
//   Nft,
//   Unknown,
// }

// export interface RoyaltyShare {
//   recipient: PublicKey;
//   share: number;
// }

// export interface Royalties {
//   bps: number;
//   shares: RoyaltyShare[];
// }

// export type MetadataExtension =
//   | {
//       none: null;
//       nft?: never;
//       unknown?: never;
//     }
//   | {
//       none?: never;
//       nft: {
//         attributes: number[];
//         signers: PublicKey[];
//         royalties: Royalties | null;
//         license: null; //
//       };
//       unknown?: never;
//     }
//   | {
//       none?: never;
//       nft?: never;
//       unknown: null;
//     };

// const parseAsset = (
//   asset: IdlAccounts<Libreplex>["metadata"]["asset"]
// ): Asset => {
//   return asset.none
//     ? {
//         none: null,
//       }
//     : asset.image
//     ? {
//         image: {
//           url: asset.image.url,
//         },
//       }
//     : asset.json
//     ? {
//         json: {
//           url: asset.json.url,
//         },
//       }
//     : asset.chainRenderer
//     ? {
//         chainRenderer: {
//           programId: asset.chainRenderer.programId,
//         },
//       }
//     : asset.inscription
//     ? {
//         inscription: {
//           accountId: asset.inscription.accountId,
//         },
//       }
//     : {
//         unknown: null,
//       };
// };

// const parseRoyalties = (
//   royalties: NonNullable<
//     NonNullable<
//       IdlAccounts<Libreplex>["metadata"]["extension"]["nft"]
//     >["royalties"]
//   >
// ): Royalties => {
//   return {
//     bps: royalties.bps,
//     shares: royalties.shares.map((item) => ({
//       recipient: item.recipient,
//       share: item.share,
//     })),
//   };
// };

// const parseExtension = (
//   extension: IdlAccounts<Libreplex>["metadata"]["extension"]
// ): MetadataExtension => {
//   return extension.none
//     ? { none: null }
//     : extension.nft
//     ? {
//         nft: {
//           attributes: [...extension.nft.attributes],
//           signers: extension.nft.signers,
//           royalties: extension.nft.royalties
//             ? parseRoyalties(extension.nft.royalties)
//             : null,
//           license: null, // fixing this to null for now even though the contract supports it
//         },
//       }
//     : {
//         unknown: null,
//       };
// };

/// cannot get anchor types to cross module boundaries. Hence having to type these out explicitly.
/// very S.A.D.
// export interface Metadata {
//   mint: PublicKey;
//   updateAuthority: PublicKey;
//   creator: PublicKey;
//   isMutable: boolean;
//   group: PublicKey | null;
//   name: string;
//   symbol: string;
//   asset: Asset;
//   description: string | null;
//   extension: MetadataExtension;
// }

export type Metadata = IdlAccounts<Libreplex>["metadata"];

export const decodeMetadata =
  (program: Program<LibreplexWithOrdinals>) =>
  (buffer: Buffer, pubkey: PublicKey) => {
    try {
      const coder = new BorshCoder(program.idl);

      const metadataRaw = coder.accounts.decode<
        Metadata
      >("metadata", buffer);
      // const metadata: Metadata = {
      //   ...metadataRaw,
      //   asset: parseAsset(metadataRaw.asset),
      //   extension: parseExtension(metadataRaw.extension),
      // };
      return {
        item: metadataRaw??null, //metadata ?? null,
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

  const {program} = useContext(LibrePlexProgramContext)


  const metadataId = useMemo(() => mintId && program ? getMetadataPda(program.programId, mintId)[0] : null, [mintId, program.programId]);

  return useMetadataById(metadataId, connection);
};

export const useMetadataById = (
  metadataKey: PublicKey | null,
  connection: Connection
) => {
  const {program} = useContext(LibrePlexProgramContext);

  const q = useFetchSingleAccount(metadataKey, connection);

  const a = decodeMetadata(program);

  const decoded = useMemo(() => {
    try {
      const obj = q?.data?.item && metadataKey ? a(q?.data?.item.buffer, metadataKey) : null;
      return obj;
    } catch (e) {
      return null;
    }
  }, [metadataKey, program, q.data?.item]);

  return decoded;

  // return useQuery<IRpcObject<Collection>[]>(collectionKeys, fetcher);
};

export const useMetadataByAuthority = (
  publicKey: PublicKey | undefined,
  connection: Connection
) => {
  const {program} = useContext(LibrePlexProgramContext);

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
  const {program} = useContext(LibrePlexProgramContext);

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
