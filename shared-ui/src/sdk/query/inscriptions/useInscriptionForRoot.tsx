
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getInscriptionPda } from "../../../pdas/getInscriptionPda";
import { useMemo } from "react";
import { useInscriptionById } from "./inscriptions";

export const useInscriptionForRoot = (root: PublicKey) => {
  const { connection } = useConnection();
  const inscriptionId = useMemo(() => root ? getInscriptionPda(root)[0] : undefined, [root]);

  return useInscriptionById(inscriptionId, connection);
};
