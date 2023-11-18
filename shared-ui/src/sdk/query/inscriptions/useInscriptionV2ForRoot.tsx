import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { getInscriptionV3Pda } from "../../../pdas";
import { useInscriptionV3ById } from "./inscriptionsv2";

export const useInscriptionV3ForRoot = (root: PublicKey) => {
  const { connection } = useConnection();
  const inscriptionId = useMemo(
    () => (root ? getInscriptionV3Pda(root)[0] : undefined),
    [root]
  );

  return {
    inscriptionId,
    inscription: useInscriptionV3ById(inscriptionId, connection),
  };
};
