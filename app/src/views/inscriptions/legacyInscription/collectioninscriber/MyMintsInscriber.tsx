import {
  getInscriptionPda,
  useTokenAccountsByOwner,
} from "@libreplex/shared-ui";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { useMultipleAccountsById } from "shared-ui/src/sdk/query/metadata/useMultipleAccountsById";
import { LegacyMintInscriber } from "./LegacyMintInscriber";

export const MyMintsInscriber = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { data, refetch, isFetching } = useTokenAccountsByOwner(
    publicKey,
    connection,
    TOKEN_PROGRAM_ID
  );

  enum View {
    WithInscriptions,
    WithoutInscriptions,
    All,
  }

  const mintIds = useMemo(() => data.map((item) => item.item.mint).sort((a,b)=>a.toBase58().localeCompare(b.toBase58())), [data]);

  return <LegacyMintInscriber mintIds={mintIds} />;
};
