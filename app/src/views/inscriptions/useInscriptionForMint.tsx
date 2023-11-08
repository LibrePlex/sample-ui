import {
    getInscriptionPda,
    useInscriptionById
} from "@libreplex/shared-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

export const useInscriptionForMint = (mint: PublicKey) => {
  const { connection } = useConnection();
  const inscriptionId = useMemo(() => mint ? getInscriptionPda(mint)[0] : undefined, [mint]);

  return useInscriptionById(inscriptionId, connection);
};
