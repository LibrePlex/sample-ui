
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getInscriptionPda } from "../../../pdas/getInscriptionPda";
import { useMemo } from "react";
import { useInscriptionById } from "./inscriptions";

export const useInscriptionForMint = (mint: PublicKey) => {
  const { connection } = useConnection();
  const inscriptionId = useMemo(() => mint ? getInscriptionPda(mint)[0] : undefined, [mint]);

  return useInscriptionById(inscriptionId, connection);
};
