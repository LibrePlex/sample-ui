import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { getInscriptionV2Pda } from "../../../pdas";
import { useInscriptionV2ById } from "./inscriptionsv2";

export const useInscriptionV2ForRoot = (root: PublicKey) => {
  const { connection } = useConnection();
  const inscriptionId = useMemo(
    () => (root ? getInscriptionV2Pda(root)[0] : undefined),
    [root]
  );

  return {
    inscriptionId,
    inscription: useInscriptionV2ById(inscriptionId, connection),
  };
};
