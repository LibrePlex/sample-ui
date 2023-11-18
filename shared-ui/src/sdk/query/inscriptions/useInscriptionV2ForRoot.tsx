import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { getInscriptionV3Pda } from "../../../pdas";
import { useInscriptionV3ById } from "./inscriptionsV3";

export const useInscriptionV3ForRoot = (root: PublicKey, live: boolean = false) => {
  const { connection } = useConnection();
  const inscriptionId = useMemo(
    () => (root ? getInscriptionV3Pda(root)[0] : undefined),
    [root]
  );

  const inscriptionV3 = useInscriptionV3ById(inscriptionId, connection);

  return {
    inscriptionId,
    inscription: inscriptionV3,
  };
};
