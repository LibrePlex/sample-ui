import {
  LibrePlexLegacyInscriptionsProgramContext,
  useFetchSingleAccount
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useContext, useMemo } from "react";
import { getLegacyInscriptionPda } from "shared-ui/src/pdas/getLegacyInscriptionPda";
import { decodeLegacyInscription } from "shared-ui/src/sdk/query/legacyInscriptions/legacyinscriptions";

export const useLegacyInscriptionForMint = (mint: PublicKey) => {
  const { connection } = useConnection();
  const legacyInscriptionId = useMemo(
    () => getLegacyInscriptionPda(mint),
    [mint]
  );
  const { data } = useFetchSingleAccount(legacyInscriptionId, connection);
  const { program } = useContext(LibrePlexLegacyInscriptionsProgramContext);

  const obj = useMemo(
    () =>
      data?.item
        ? decodeLegacyInscription(program)(data.item.buffer, data.pubkey)
        : undefined,
    [data?.item, data?.pubkey, program]
  );
  return obj;
};
