import { BorshCoder, IdlAccounts, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { LibrePlexProgramContext } from "anchor/LibrePlexProgramContext";
import { LibreplexWithOrdinals } from "anchor/getProgramInstance";
import bs58 from "bs58";
import { sha256 } from "js-sha256";
import { useContext, useMemo } from "react";
import { LibreplexMetadata as Libreplex } from "types/libreplex_metadata";
import { useGpa } from "./gpa";
import { useFetchSingleAccount } from "./singleAccountInfo";

export type MetadataExtended = IdlAccounts<Libreplex>["metadataExtension"];

export const decodeMetadataExtension =
  (program: Program<LibreplexWithOrdinals>) =>
  (buffer: Buffer, pubkey: PublicKey) => {
    const coder = new BorshCoder(program.idl);

    const metadata = coder.accounts.decode<MetadataExtended>(
      "metadataExtension",
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
  const program = useContext(LibrePlexProgramContext);

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
              sha256.array("account:MetadataExtension").slice(0, 8)
            ),
          },
        },
      ];
      return filters;
    } else {
      return null;
    }
  }, [group]);

  const { data: rawData, isFetching } = useGpa(
    program.programId,
    filters,
    connection,
    [group?.toBase58() ?? "", `metadataextended-by-group`]
  );

  const metadataExtended = useMemo(
    () =>
      rawData
        ?.map((item) => {
          try {
            const obj = decodeMetadataExtension(program)(
              item.item,
              item.pubkey
            );
            return obj;
          } catch (e) {
            return null;
          }
        })
        .filter((item) => item) ?? [],
    [program, rawData]
  );

  return { metadata: metadataExtended, isFetching };
};

// export const useMetadataExtendedById = (
//   metadataExtendedKeys: PublicKey[],
//   connection: Connection
// ) => {
//   const program  = useContext(LibrePlexProgramContext);

//   const q = useFetchMultiAccounts(metadataExtendedKeys, connection);

//   const decoded = useMemo(
//     () => ({
//       ...q,
//       data:
//         q?.data
//           ?.map((item) => {
//             try {
//               const obj = decodeMetadataExtension(program)(
//                 item.item,
//                 item.pubkey
//               );
//               return obj;
//             } catch (e) {
//               return null;
//             }
//           })
//           .filter((item) => item) ?? [],
//     }),

//     [program, q]
//   );

//   return decoded;

// };

export const useMetadataExtendedById = (
  metadataExtendedKey: PublicKey,
  connection: Connection
) => {
  const program = useContext(LibrePlexProgramContext);

  const q = useFetchSingleAccount(metadataExtendedKey, connection);

  const decoded = useMemo(() => {
    try {
      const obj = decodeMetadataExtension(program)(
        q.data.item,
        metadataExtendedKey
      );
      return obj;
    } catch (e) {
      return null;
    }
  }, [metadataExtendedKey, program, q.data?.item]);

  return decoded;
};
